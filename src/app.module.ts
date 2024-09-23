import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { GeminiAIModule } from './modules/geminiAI/geminiAI.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    GeminiAIModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
