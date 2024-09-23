import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeminiAIService } from './geminiAI.service';

@ApiTags('GeminiAI')
@Controller('ai')
export class GeminiAIController {
  constructor(private readonly service: GeminiAIService) {}

  @ApiOperation({
    summary: 'Gemini AI test',
  })
  @ApiResponse({ status: 201 })
  @Get('test')
  async sendMail() {
    return await this.service.test();
  }
}
