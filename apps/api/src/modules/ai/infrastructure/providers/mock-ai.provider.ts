import { Injectable } from '@nestjs/common';
import {
  AiProviderPort,
  GenerateCardExamplesInput,
  GenerateCardExamplesResult,
} from '../../application/ports/ai-provider.port';

@Injectable()
export class MockAiProvider implements AiProviderPort {
  readonly providerName = 'MOCK' as const;

  generateCardExamples(
    input: GenerateCardExamplesInput,
  ): Promise<GenerateCardExamplesResult> {
    const front = input.front.trim();
    const back = input.back.trim();

    return Promise.resolve({
      examples: [
        { text: `Example with ${front}: I use this word every day.` },
        { text: `Another example for ${back}: This helps me remember it.` },
        {
          text: `Practice sentence: When I see "${front}", I think of "${back}".`,
        },
      ],
      rawOutputPreview: 'mock output',
    });
  }
}
