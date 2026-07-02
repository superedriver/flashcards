export type BuildCardExamplePromptInput = {
  front: string;
  back: string;
  existingExample?: string | null;
  notes?: string | null;
  locale?: string | null;
};

export type BuildCardExamplePromptResult = {
  prompt: string;
};

const PROMPT_MAX_LENGTH = 4000;

export class CardExamplePromptService {
  build(input: BuildCardExamplePromptInput): BuildCardExamplePromptResult {
    const lines = [
      'Generate exactly 3 concise example sentences for a flashcard learner.',
      'Use clear context suitable for memorization.',
      'Return plain text only: no markdown, numbering, or bullet points.',
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

    const prompt = lines.join('\n');

    return {
      prompt:
        prompt.length <= PROMPT_MAX_LENGTH
          ? prompt
          : prompt.slice(0, PROMPT_MAX_LENGTH),
    };
  }
}
