import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { StartupProfile } from './entities/startup-profile.entity';
import { InvestorProfile } from './entities/investor-profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateStartupProfileDto, CreateInvestorProfileDto } from './dto/profile.dto';
import { UserType } from '@/common/enums/user-type.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(StartupProfile)
    private startupProfileRepository: Repository<StartupProfile>,
    @InjectRepository(InvestorProfile)
    private investorProfileRepository: Repository<InvestorProfile>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { email },
      relations: ['startupProfile', 'investorProfile'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { id },
      relations: ['startupProfile', 'investorProfile'],
    });
  }

  async createStartupProfile(
    userId: string, 
    profileDto: CreateStartupProfileDto,
  ): Promise<StartupProfile> {
    const user = await this.findById(userId);
    if (!user || user.userType !== UserType.STARTUP) {
      throw new NotFoundException('Startup user not found');
    }

    // Generate unique slug from name
    const slug = profileDto.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Convert arrays to JSON strings for SQLite compatibility
    const profileData = {
      ...profileDto,
      sectors: JSON.stringify(profileDto.sectors),
      locations: JSON.stringify(profileDto.locations || []),
      valueAddNeeds: JSON.stringify(profileDto.valueAddNeeds || []),
      nonNegotiables: JSON.stringify(profileDto.nonNegotiables || []),
      slug,
      userId,
    };

    const profile = this.startupProfileRepository.create(profileData);

    return this.startupProfileRepository.save(profile);
  }

  async createInvestorProfile(
    userId: string, 
    profileDto: CreateInvestorProfileDto,
  ): Promise<InvestorProfile> {
    const user = await this.findById(userId);
    if (!user || user.userType !== UserType.INVESTOR) {
      throw new NotFoundException('Investor user not found');
    }

    // Convert arrays to JSON strings for SQLite compatibility
    const profileData = {
      ...profileDto,
      stagePreferences: JSON.stringify(profileDto.stagePreferences),
      sectorFocus: JSON.stringify(profileDto.sectorFocus),
      geoFocus: JSON.stringify(profileDto.geoFocus),
      valueAddOffered: JSON.stringify(profileDto.valueAddOffered || []),
      userId,
    };

    const profile = this.investorProfileRepository.create(profileData);

    return this.investorProfileRepository.save(profile);
  }

  async getProfile(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      userType: user.userType,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      isVerified: user.isVerified,
      profile: user.userType === UserType.STARTUP ? user.startupProfile : user.investorProfile,
    };
  }

  async findPotentialMatches(userId: string, limit: number = 20) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get users of opposite type
    const targetUserType = user.userType === UserType.STARTUP 
      ? UserType.INVESTOR 
      : UserType.STARTUP;

    return this.userRepository.find({
      where: { 
        userType: targetUserType,
        isActive: true,
      },
      relations: ['startupProfile', 'investorProfile'],
      take: limit,
    });
  }
}
