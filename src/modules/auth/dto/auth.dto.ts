import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserType } from '@/common/enums/user-type.enum';

export class SignupDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserType })
  @IsEnum(UserType)
  userType: UserType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: {
    id: string;
    email: string;
    userType: UserType;
    firstName?: string;
    lastName?: string;
  };
}
