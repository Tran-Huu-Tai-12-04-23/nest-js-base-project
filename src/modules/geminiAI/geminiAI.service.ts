import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiAIService {
  constructor(public readonly configService: ConfigService) {}
  GEMINI_API_KEY = this.configService.get<string>('GEMINI_API_KEY') || '';
  genAI = new GoogleGenerativeAI(this.GEMINI_API_KEY);
  model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async test() {
    const result = await this.model.generateContent(['Explain how AI works']);
    console.log(result.response.text());

    return result;
  }
}
