import { Module } from '@nestjs/common';
import { AI_PROVIDER } from './application/ports/ai-provider.port';
import { MockAiProvider } from './infrastructure/providers/mock-ai.provider';

@Module({
  providers: [
    MockAiProvider,
    {
      provide: AI_PROVIDER,
      useExisting: MockAiProvider,
    },
  ],
  exports: [AI_PROVIDER],
})
export class AiModule {}
