import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserType } from '@/common/enums/user-type.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
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
