import { Module } from '@nestjs/common';
import { GeminiAIController } from './geminiAI.controller';
import { GeminiAIService } from './geminiAI.service';

@Module({
  imports: [],
  providers: [GeminiAIService],
  controllers: [GeminiAIController],
  exports: [GeminiAIService],
})
export class GeminiAIModule {}
