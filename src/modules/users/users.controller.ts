import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards, 
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateStartupProfileDto, CreateInvestorProfileDto } from './dto/profile.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Post('startup-profile')
  @ApiOperation({ summary: 'Create startup profile' })
  @ApiResponse({ status: 201, description: 'Startup profile created successfully' })
  async createStartupProfile(
    @Request() req,
    @Body() profileDto: CreateStartupProfileDto,
  ) {
    return this.usersService.createStartupProfile(req.user.id, profileDto);
  }

  @Post('investor-profile')
  @ApiOperation({ summary: 'Create investor profile' })
  @ApiResponse({ status: 201, description: 'Investor profile created successfully' })
  async createInvestorProfile(
    @Request() req,
    @Body() profileDto: CreateInvestorProfileDto,
  ) {
    return this.usersService.createInvestorProfile(req.user.id, profileDto);
  }
}
