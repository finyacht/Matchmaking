import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { SwipeDirection } from '@/common/enums/user-type.enum';

export class SwipeDto {
  @ApiProperty()
  @IsUUID()
  targetId: string;

  @ApiProperty({ enum: SwipeDirection })
  @IsEnum(SwipeDirection)
  direction: SwipeDirection;
}

export class FeedFiltersDto {
  @ApiProperty({ required: false, minimum: 1, maximum: 50 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 20;

  @ApiProperty({ required: false })
  @IsOptional()
  sectors?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  stage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minValuation?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxValuation?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  location?: string;
}

export class MatchResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  mutualScore: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  startup: {
    id: string;
    name: string;
    stage: string;
    sectors: string[];
    valuation?: number;
    arr?: number;
  };

  @ApiProperty()
  investor: {
    id: string;
    name: string;
    type: string;
    sectorFocus: string[];
    checkSizeMin: number;
    checkSizeMax: number;
  };
}
