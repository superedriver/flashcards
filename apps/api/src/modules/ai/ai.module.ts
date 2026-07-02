import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AI_PROVIDER } from './application/ports/ai-provider.port';
import { GeminiAiProvider } from './infrastructure/providers/gemini-ai.provider';
import { MockAiProvider } from './infrastructure/providers/mock-ai.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    MockAiProvider,
    GeminiAiProvider,
    {
      provide: AI_PROVIDER,
      useFactory: (
        configService: ConfigService,
        mockAiProvider: MockAiProvider,
        geminiAiProvider: GeminiAiProvider,
      ) => {
        const provider = configService.get<string>('ai.provider', 'mock');

        if (provider === 'gemini') {
          return geminiAiProvider;
        }

        return mockAiProvider;
      },
      inject: [ConfigService, MockAiProvider, GeminiAiProvider],
    },
  ],
  exports: [AI_PROVIDER],
})
export class AiModule {}
