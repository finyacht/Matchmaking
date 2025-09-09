import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsEnum, 
  IsNumber, 
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { 
  StartupStage, 
  InvestorType,
} from '@/common/enums/user-type.enum';

export class CreateStartupProfileDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  sectors: string[];

  @ApiProperty({ enum: StartupStage })
  @IsEnum(StartupStage)
  stage: StartupStage;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastRound?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lastRoundSize?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valuation?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  arr?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  mrr?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000)
  growthYoyPct?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  burnRateMonthly?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  runwayMonths?: number;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  locations?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  valueAddNeeds?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nonNegotiables?: string[];
}

export class CreateInvestorProfileDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: InvestorType })
  @IsEnum(InvestorType)
  type: InvestorType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fundSize?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  checkSizeMin: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  checkSizeMax: number;

  @ApiProperty({ enum: StartupStage, isArray: true })
  @IsArray()
  @IsEnum(StartupStage, { each: true })
  stagePreferences: StartupStage[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  sectorFocus: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  geoFocus: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reserveStrategy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  avgTimeToCloseDays?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  willLead?: boolean;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  valueAddOffered?: string[];
}
