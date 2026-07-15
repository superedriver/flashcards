export type BuildTranslateCardBackPromptInput = {
  front: string;
  targetLanguage: string;
  sourceLanguage: string;
};

export type BuildTranslateCardBackPromptResult = {
  prompt: string;
};

const PROMPT_MAX_LENGTH = 4000;

export class TranslateCardBackPromptService {
  build(
    input: BuildTranslateCardBackPromptInput,
  ): BuildTranslateCardBackPromptResult {
    const lines = [
      'Translate the flashcard front text into the source language for the back side.',
      'Return plain text only: the translated back text with no markdown or quotes.',
      `Target language code: ${input.targetLanguage.trim()}`,
      `Source language code: ${input.sourceLanguage.trim()}`,
      `Front: ${input.front.trim()}`,
    ];

    if (input.targetLanguage.trim() === input.sourceLanguage.trim()) {
      lines.push(
        'The target and source languages are the same. Provide a definition or synonym in that language.',
      );
    }

    const prompt = lines.join('\n');

    return {
      prompt:
        prompt.length <= PROMPT_MAX_LENGTH
          ? prompt
          : prompt.slice(0, PROMPT_MAX_LENGTH),
    };
  }
}
