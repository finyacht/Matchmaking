import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query,
  UseGuards, 
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { MatchingService } from './matching.service';
import { SwipeDto, FeedFiltersDto, MatchResponseDto } from './dto/matching.dto';

@ApiTags('matching')
@Controller('matching')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MatchingController {
  constructor(private matchingService: MatchingService) {}

  @Get('feed')
  @ApiOperation({ summary: 'Get personalized feed of potential matches' })
  @ApiResponse({ status: 200, description: 'Feed retrieved successfully' })
  async getFeed(
    @Request() req,
    @Query() filters: FeedFiltersDto,
  ) {
    return this.matchingService.getFeed(req.user.id, filters);
  }

  @Post('swipe')
  @ApiOperation({ summary: 'Swipe on a potential match' })
  @ApiResponse({ status: 201, description: 'Swipe recorded successfully' })
  async swipe(
    @Request() req,
    @Body() swipeDto: SwipeDto,
  ) {
    return this.matchingService.swipe(req.user.id, swipeDto);
  }

  @Get('matches')
  @ApiOperation({ summary: 'Get all mutual matches' })
  @ApiResponse({ 
    status: 200, 
    description: 'Matches retrieved successfully',
    type: [MatchResponseDto],
  })
  async getMatches(@Request() req) {
    return this.matchingService.getMatches(req.user.id);
  }
}
