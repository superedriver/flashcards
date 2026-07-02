import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  AiProviderPort,
  GenerateCardExamplesInput,
  GenerateCardExamplesResult,
} from '../../application/ports/ai-provider.port';

const OUTPUT_PREVIEW_MAX_LENGTH = 1000;
const EXAMPLE_COUNT = 3;

@Injectable()
export class GeminiAiProvider implements AiProviderPort {
  readonly providerName = 'GEMINI' as const;

  constructor(private readonly configService: ConfigService) {}

  async generateCardExamples(
    input: GenerateCardExamplesInput,
  ): Promise<GenerateCardExamplesResult> {
    const apiKey = this.configService.get<string>('ai.apiKey', '');

    if (!apiKey) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'AI provider is not configured',
      );
    }

    const prompt = buildGeminiPrompt(input);

    try {
      const client = new GoogleGenerativeAI(apiKey);
      const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const response = await model.generateContent(prompt);
      const rawText = response.response.text().trim();
      const examples = parseExamples(rawText, input);

      return {
        examples,
        rawOutputPreview: truncatePreview(rawText, OUTPUT_PREVIEW_MAX_LENGTH),
      };
    } catch {
      throw new ApplicationError(
        ErrorCodes.INTERNAL_ERROR,
        'Failed to generate card examples',
      );
    }
  }
}

function buildGeminiPrompt(input: GenerateCardExamplesInput): string {
  const lines = [
    'Generate exactly 3 concise example sentences for a flashcard.',
    'Return one sentence per line.',
    'Do not use markdown, numbering, or bullet points.',
    `Front: ${input.front.trim()}`,
    `Back: ${input.back.trim()}`,
  ];

  if (input.existingExample?.trim()) {
    lines.push(`Existing example: ${input.existingExample.trim()}`);
  }

  if (input.notes?.trim()) {
    lines.push(`Notes: ${input.notes.trim()}`);
  }

  if (input.locale?.trim()) {
    lines.push(`Preferred language/locale: ${input.locale.trim()}`);
  }

  return lines.join('\n');
}

function parseExamples(
  rawText: string,
  input: GenerateCardExamplesInput,
): GenerateCardExamplesResult['examples'] {
  const lines = rawText
    .split('\n')
    .map((line) => line.replace(/^\s*[-*]\s*/, '').replace(/^\d+[.)]\s*/, ''))
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const examples = lines.slice(0, EXAMPLE_COUNT).map((text) => ({ text }));

  if (examples.length >= EXAMPLE_COUNT) {
    return examples;
  }

  const front = input.front.trim();
  const back = input.back.trim();

  while (examples.length < EXAMPLE_COUNT) {
    examples.push({
      text: `Example for ${front} (${back}).`,
    });
  }

  return examples;
}

function truncatePreview(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return value.slice(0, maxLength);
}
