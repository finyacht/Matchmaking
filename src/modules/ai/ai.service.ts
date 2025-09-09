import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  async parsePitchDeck(pitchDeckText: string): Promise<any> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `
    Analyze the following pitch deck content and extract key information in JSON format:

    ${pitchDeckText}

    Please extract and return a JSON object with the following structure:
    {
      "companyName": "string",
      "tagline": "string", 
      "problem": "string",
      "solution": "string",
      "marketSize": "string",
      "businessModel": "string",
      "traction": {
        "revenue": "number or null",
        "arr": "number or null",
        "customers": "number or null",
        "growth": "string"
      },
      "fundingAsk": "number or null",
      "useOfFunds": "string",
      "team": ["array of key team members"],
      "competitors": ["array of competitors"],
      "risks": ["array of key risks"]
    }

    If any information is not available, use null or an empty array as appropriate.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing pitch deck:', error);
      throw error;
    }
  }

  async generateStartupSummary(profile: any): Promise<string> {
    if (!this.openai) {
      return this.generateSimpleSummary(profile);
    }

    const prompt = `
    Generate a concise, engaging one-line summary for this startup profile:
    
    Name: ${profile.name}
    Stage: ${profile.stage}
    Sectors: ${profile.sectors?.join(', ')}
    ARR: ${profile.arr ? '$' + profile.arr : 'Not disclosed'}
    Valuation: ${profile.valuation ? '$' + profile.valuation : 'Not disclosed'}
    Growth: ${profile.growthYoyPct ? profile.growthYoyPct + '% YoY' : 'Not disclosed'}
    Description: ${profile.description || 'No description'}
    
    Make it sound compelling and highlight the most impressive metrics.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 100,
      });

      return response.choices[0].message.content?.trim() || this.generateSimpleSummary(profile);
    } catch (error) {
      console.error('Error generating summary:', error);
      return this.generateSimpleSummary(profile);
    }
  }

  async generateInvestorSummary(profile: any): Promise<string> {
    if (!this.openai) {
      return this.generateSimpleInvestorSummary(profile);
    }

    const prompt = `
    Generate a concise, professional one-line summary for this investor profile:
    
    Name: ${profile.name}
    Type: ${profile.type}
    Check Size: $${profile.checkSizeMin} - $${profile.checkSizeMax}
    Sectors: ${profile.sectorFocus?.join(', ')}
    Stages: ${profile.stagePreferences?.join(', ')}
    Description: ${profile.description || 'No description'}
    
    Make it sound professional and highlight their investment focus.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 100,
      });

      return response.choices[0].message.content?.trim() || this.generateSimpleInvestorSummary(profile);
    } catch (error) {
      console.error('Error generating summary:', error);
      return this.generateSimpleInvestorSummary(profile);
    }
  }

  private generateSimpleSummary(profile: any): string {
    const metrics = [];
    if (profile.arr) metrics.push(`$${profile.arr} ARR`);
    if (profile.growthYoyPct) metrics.push(`${profile.growthYoyPct}% growth`);
    
    return `${profile.stage} ${profile.sectors?.[0] || 'startup'} ${metrics.length ? '• ' + metrics.join(', ') : ''}`.trim();
  }

  private generateSimpleInvestorSummary(profile: any): string {
    const checkRange = `$${profile.checkSizeMin}-${profile.checkSizeMax}`;
    const focus = profile.sectorFocus?.[0] || 'various sectors';
    
    return `${profile.type} investor • ${checkRange} checks • ${focus}`;
  }
}
