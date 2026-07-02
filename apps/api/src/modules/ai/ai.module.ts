import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AI_PROVIDER } from './application/ports/ai-provider.port';
import { AI_REQUEST_LOG_REPOSITORY } from './application/ports/ai-request-log-repository.port';
import { PrismaAiRequestLogRepository } from './infrastructure/persistence/prisma-ai-request-log.repository';
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
    {
      provide: AI_REQUEST_LOG_REPOSITORY,
      useClass: PrismaAiRequestLogRepository,
    },
  ],
  exports: [AI_PROVIDER, AI_REQUEST_LOG_REPOSITORY],
})
export class AiModule {}
