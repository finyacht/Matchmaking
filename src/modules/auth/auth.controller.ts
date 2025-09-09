import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import { RateLimitGuard } from '@/common/guards/rate-limit.guard';

@ApiTags('auth')
@Controller('auth')
@UseGuards(RateLimitGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully created',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async signup(@Body() signupDto: SignupDto): Promise<AuthResponseDto> {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }
}
