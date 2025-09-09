import { 
  Controller, 
  Post, 
  Body, 
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';

@ApiTags('ai')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('parse-pitch-deck')
  @ApiOperation({ summary: 'Parse pitch deck content using AI' })
  @ApiResponse({ status: 200, description: 'Pitch deck parsed successfully' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async parsePitchDeck(
    @UploadedFile() file: Express.Multer.File,
    @Body('text') text?: string,
  ) {
    const content = text || file?.buffer?.toString() || '';
    return this.aiService.parsePitchDeck(content);
  }

  @Post('generate-embedding')
  @ApiOperation({ summary: 'Generate text embedding' })
  @ApiResponse({ status: 200, description: 'Embedding generated successfully' })
  async generateEmbedding(@Body('text') text: string) {
    const embedding = await this.aiService.generateEmbedding(text);
    return { embedding };
  }

  @Post('generate-summary')
  @ApiOperation({ summary: 'Generate profile summary' })
  @ApiResponse({ status: 200, description: 'Summary generated successfully' })
  async generateSummary(
    @Body('profile') profile: any,
    @Body('type') type: 'startup' | 'investor',
  ) {
    const summary = type === 'startup' 
      ? await this.aiService.generateStartupSummary(profile)
      : await this.aiService.generateInvestorSummary(profile);
    
    return { summary };
  }
}
