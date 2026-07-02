import { GeneratedCardExample } from '../../domain/types';

export const AI_PROVIDER = Symbol('AI_PROVIDER');

export type GenerateCardExamplesInput = {
  front: string;
  back: string;
  existingExample?: string | null;
  notes?: string | null;
  locale?: string | null;
};

export type GenerateCardExamplesResult = {
  examples: GeneratedCardExample[];
  rawOutputPreview: string | null;
};

export type AiProviderPort = {
  readonly providerName: 'MOCK' | 'GEMINI';
  generateCardExamples(
    input: GenerateCardExamplesInput,
  ): Promise<GenerateCardExamplesResult>;
};
