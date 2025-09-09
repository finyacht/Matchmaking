import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Match } from './entities/match.entity';
import { Swipe } from './entities/swipe.entity';
import { UsersService } from '@/modules/users/users.service';
import { SwipeDto, FeedFiltersDto } from './dto/matching.dto';
import { 
  UserType, 
  SwipeDirection, 
  MatchStatus,
  StartupStage,
} from '@/common/enums/user-type.enum';
import { User } from '@/modules/users/entities/user.entity';
import { StartupProfile } from '@/modules/users/entities/startup-profile.entity';
import { InvestorProfile } from '@/modules/users/entities/investor-profile.entity';

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(Swipe)
    private swipeRepository: Repository<Swipe>,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async getFeed(userId: string, filters: FeedFiltersDto) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check daily swipe limit
    await this.checkSwipeLimit(userId, user.userType);

    // Get already swiped user IDs
    const swipedUserIds = await this.getSwipedUserIds(userId);

    // Get potential matches excluding already swiped
    const candidates = await this.findCandidates(user, swipedUserIds, filters);

    // Calculate scores and rank
    const scoredCandidates = await Promise.all(
      candidates.map(async (candidate) => {
        const score = await this.calculateCompatibilityScore(user, candidate);
        return {
          ...candidate,
          compatibilityScore: score,
        };
      }),
    );

    // Sort by score and return
    return scoredCandidates
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, filters.limit)
      .map(candidate => this.formatCandidateForFeed(candidate));
  }

  async swipe(userId: string, swipeDto: SwipeDto) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check daily swipe limit
    await this.checkSwipeLimit(userId, user.userType);

    const target = await this.usersService.findById(swipeDto.targetId);
    if (!target) {
      throw new NotFoundException('Target user not found');
    }

    // Check if already swiped
    const existingSwipe = await this.swipeRepository.findOne({
      where: { userId, targetId: swipeDto.targetId },
    });

    if (existingSwipe) {
      throw new BadRequestException('Already swiped on this user');
    }

    // Calculate score at time of swipe
    const score = await this.calculateCompatibilityScore(user, target);

    // Create swipe record
    const swipe = this.swipeRepository.create({
      userId,
      targetId: swipeDto.targetId,
      direction: swipeDto.direction,
      scoreAtSwipe: score,
    });

    await this.swipeRepository.save(swipe);

    // Check for mutual match if right swipe
    let match = null;
    if (swipeDto.direction === SwipeDirection.RIGHT) {
      match = await this.checkForMutualMatch(userId, swipeDto.targetId);
    }

    return {
      swipeId: swipe.id,
      match: match ? await this.formatMatch(match) : null,
    };
  }

  async getMatches(userId: string) {
    const matches = await this.matchRepository.find({
      where: [
        { startupId: userId, status: MatchStatus.MATCHED },
        { investorId: userId, status: MatchStatus.MATCHED },
      ],
      relations: ['startup', 'investor', 'startup.startupProfile', 'investor.investorProfile'],
      order: { createdAt: 'DESC' },
    });

    return Promise.all(matches.map(match => this.formatMatch(match)));
  }

  private async checkSwipeLimit(userId: string, userType: UserType) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const swipeCount = await this.swipeRepository.count({
      where: {
        userId,
        createdAt: {
          $gte: today,
        } as any,
      },
    });

    const dailyLimit = userType === UserType.STARTUP
      ? this.configService.get('STARTUP_DAILY_SWIPES', 20)
      : this.configService.get('INVESTOR_DAILY_SWIPES', 50);

    if (swipeCount >= dailyLimit) {
      throw new BadRequestException('Daily swipe limit reached');
    }
  }

  private async getSwipedUserIds(userId: string): Promise<string[]> {
    const swipes = await this.swipeRepository.find({
      where: { userId },
      select: ['targetId'],
    });

    return swipes.map(swipe => swipe.targetId);
  }

  private async findCandidates(
    user: User, 
    excludeIds: string[], 
    filters: FeedFiltersDto,
  ): Promise<User[]> {
    const targetUserType = user.userType === UserType.STARTUP 
      ? UserType.INVESTOR 
      : UserType.STARTUP;

    const queryBuilder = this.usersService['userRepository']
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.startupProfile', 'startup')
      .leftJoinAndSelect('user.investorProfile', 'investor')
      .where('user.userType = :userType', { userType: targetUserType })
      .andWhere('user.isActive = true')
      .andWhere('user.id NOT IN (:...excludeIds)', { 
        excludeIds: excludeIds.length > 0 ? excludeIds : [''] 
      });

    // Apply filters
    if (filters.sectors && filters.sectors.length > 0) {
      if (targetUserType === UserType.STARTUP) {
        queryBuilder.andWhere('startup.sectors && :sectors', { sectors: filters.sectors });
      } else {
        queryBuilder.andWhere('investor.sectorFocus && :sectors', { sectors: filters.sectors });
      }
    }

    if (filters.stage) {
      if (targetUserType === UserType.STARTUP) {
        queryBuilder.andWhere('startup.stage = :stage', { stage: filters.stage });
      } else {
        queryBuilder.andWhere(':stage = ANY(investor.stagePreferences)', { stage: filters.stage });
      }
    }

    if (filters.minValuation && targetUserType === UserType.STARTUP) {
      queryBuilder.andWhere('startup.valuation >= :minValuation', { 
        minValuation: filters.minValuation 
      });
    }

    if (filters.maxValuation && targetUserType === UserType.STARTUP) {
      queryBuilder.andWhere('startup.valuation <= :maxValuation', { 
        maxValuation: filters.maxValuation 
      });
    }

    return queryBuilder.limit(100).getMany();
  }

  private async calculateCompatibilityScore(user1: User, user2: User): Promise<number> {
    let score = 0;
    const weights = {
      stage: 20,
      sector: 18,
      checkSize: 15,
      geography: 10,
      kpis: 12,
      valueAdd: 8,
      culture: 6,
      reputation: 5,
      timing: 6,
    };

    if (user1.userType === UserType.STARTUP && user2.userType === UserType.INVESTOR) {
      score = this.calculateStartupInvestorScore(user1.startupProfile, user2.investorProfile, weights);
    } else if (user1.userType === UserType.INVESTOR && user2.userType === UserType.STARTUP) {
      score = this.calculateStartupInvestorScore(user2.startupProfile, user1.investorProfile, weights);
    }

    return Math.round(score);
  }

  private calculateStartupInvestorScore(
    startup: StartupProfile, 
    investor: InvestorProfile, 
    weights: any,
  ): number {
    let totalScore = 0;

    // Stage fit
    const stageFit = investor.stagePreferences.includes(startup.stage) ? 1 : 0.3;
    totalScore += stageFit * weights.stage;

    // Sector fit
    const sectorOverlap = startup.sectors.filter(s => 
      investor.sectorFocus.some(f => f.toLowerCase() === s.toLowerCase())
    ).length;
    const sectorFit = Math.min(sectorOverlap / Math.max(startup.sectors.length, 1), 1);
    totalScore += sectorFit * weights.sector;

    // Check size / valuation fit
    let checkSizeFit = 0;
    if (startup.valuation && startup.lastRoundSize) {
      const targetCheckSize = startup.lastRoundSize;
      if (targetCheckSize >= investor.checkSizeMin && targetCheckSize <= investor.checkSizeMax) {
        checkSizeFit = 1;
      } else if (targetCheckSize < investor.checkSizeMin) {
        checkSizeFit = Math.max(0, 1 - (investor.checkSizeMin - targetCheckSize) / investor.checkSizeMin);
      } else {
        checkSizeFit = Math.max(0, 1 - (targetCheckSize - investor.checkSizeMax) / investor.checkSizeMax);
      }
    } else {
      checkSizeFit = 0.5; // Neutral if no data
    }
    totalScore += checkSizeFit * weights.checkSize;

    // Geography fit (simplified - assume good fit for MVP)
    totalScore += 0.8 * weights.geography;

    // KPIs fit (simplified scoring based on ARR)
    let kpisFit = 0.5;
    if (startup.arr) {
      // Basic scoring - can be enhanced with more sophisticated logic
      if (startup.arr >= 500000) kpisFit = 1;
      else if (startup.arr >= 100000) kpisFit = 0.8;
      else if (startup.arr >= 50000) kpisFit = 0.6;
    }
    totalScore += kpisFit * weights.kpis;

    // Value-add alignment (simplified)
    const valueAddFit = startup.valueAddNeeds.filter(need =>
      investor.valueAddOffered?.includes(need)
    ).length > 0 ? 1 : 0.5;
    totalScore += valueAddFit * weights.valueAdd;

    // Culture fit (placeholder - would use embeddings in full implementation)
    totalScore += 0.7 * weights.culture;

    // Reputation (placeholder)
    totalScore += 0.6 * weights.reputation;

    // Timing (placeholder)
    totalScore += 0.8 * weights.timing;

    return totalScore;
  }

  private async checkForMutualMatch(userId: string, targetId: string): Promise<Match | null> {
    // Check if target has swiped right on user
    const targetSwipe = await this.swipeRepository.findOne({
      where: {
        userId: targetId,
        targetId: userId,
        direction: SwipeDirection.RIGHT,
      },
    });

    if (!targetSwipe) {
      return null;
    }

    // Create mutual match
    const user = await this.usersService.findById(userId);
    const target = await this.usersService.findById(targetId);

    const startupId = user.userType === UserType.STARTUP ? userId : targetId;
    const investorId = user.userType === UserType.INVESTOR ? userId : targetId;

    const startup = user.userType === UserType.STARTUP ? user : target;
    const investor = user.userType === UserType.INVESTOR ? user : target;

    const startupScore = await this.calculateCompatibilityScore(startup, investor);
    const investorScore = await this.calculateCompatibilityScore(investor, startup);
    const mutualScore = Math.sqrt(startupScore * investorScore);

    const match = this.matchRepository.create({
      startupId,
      investorId,
      startupScore,
      investorScore,
      mutualScore,
      status: MatchStatus.MATCHED,
    });

    return this.matchRepository.save(match);
  }

  private formatCandidateForFeed(candidate: any) {
    const isStartup = candidate.userType === UserType.STARTUP;
    const profile = isStartup ? candidate.startupProfile : candidate.investorProfile;

    if (isStartup) {
      return {
        id: candidate.id,
        type: 'startup',
        name: profile?.name || 'Unnamed Startup',
        stage: profile?.stage,
        sectors: profile?.sectors || [],
        valuation: profile?.valuation,
        arr: profile?.arr,
        growth: profile?.growthYoyPct,
        description: profile?.description,
        compatibilityScore: candidate.compatibilityScore,
      };
    } else {
      return {
        id: candidate.id,
        type: 'investor',
        name: profile?.name || 'Unnamed Investor',
        investorType: profile?.type,
        sectorFocus: profile?.sectorFocus || [],
        checkSizeMin: profile?.checkSizeMin,
        checkSizeMax: profile?.checkSizeMax,
        stagePreferences: profile?.stagePreferences || [],
        description: profile?.description,
        compatibilityScore: candidate.compatibilityScore,
      };
    }
  }

  private async formatMatch(match: Match) {
    return {
      id: match.id,
      mutualScore: match.mutualScore,
      createdAt: match.createdAt,
      startup: {
        id: match.startup.id,
        name: match.startup.startupProfile?.name || 'Unnamed Startup',
        stage: match.startup.startupProfile?.stage,
        sectors: match.startup.startupProfile?.sectors || [],
        valuation: match.startup.startupProfile?.valuation,
        arr: match.startup.startupProfile?.arr,
      },
      investor: {
        id: match.investor.id,
        name: match.investor.investorProfile?.name || 'Unnamed Investor',
        type: match.investor.investorProfile?.type,
        sectorFocus: match.investor.investorProfile?.sectorFocus || [],
        checkSizeMin: match.investor.investorProfile?.checkSizeMin,
        checkSizeMax: match.investor.investorProfile?.checkSizeMax,
      },
    };
  }
}
