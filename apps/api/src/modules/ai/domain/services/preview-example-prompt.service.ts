export type BuildPreviewExamplePromptInput = {
  front: string;
  back: string;
  targetLanguage: string;
  sourceLanguage: string;
};

export type BuildPreviewExamplePromptResult = {
  prompt: string;
};

const PROMPT_MAX_LENGTH = 4000;

export class PreviewExamplePromptService {
  build(
    input: BuildPreviewExamplePromptInput,
  ): BuildPreviewExamplePromptResult {
    const lines = [
      'Generate exactly one concise example sentence for a flashcard learner.',
      'The sentence must be in the target language and must use the front word/phrase naturally.',
      'Return plain text only: one sentence with no markdown, numbering, or quotes.',
      `Target language code: ${input.targetLanguage.trim()}`,
      `Source language code: ${input.sourceLanguage.trim()}`,
      `Front: ${input.front.trim()}`,
      `Back: ${input.back.trim()}`,
    ];

    const prompt = lines.join('\n');

    return {
      prompt:
        prompt.length <= PROMPT_MAX_LENGTH
          ? prompt
          : prompt.slice(0, PROMPT_MAX_LENGTH),
    };
  }
}
