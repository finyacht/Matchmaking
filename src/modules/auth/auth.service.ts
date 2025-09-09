import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '@/modules/users/users.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.usersService.findByEmail(signupDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 12);
    
    const user = await this.usersService.create({
      ...signupDto,
      password: hashedPassword,
    });

    const token = this.generateToken(user);
    
    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    
    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  private generateToken(user: User): string {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      userType: user.userType 
    };
    return this.jwtService.sign(payload);
  }
}
