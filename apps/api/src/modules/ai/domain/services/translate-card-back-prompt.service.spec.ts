import { TranslateCardBackPromptService } from './translate-card-back-prompt.service';

describe('TranslateCardBackPromptService', () => {
  const service = new TranslateCardBackPromptService();

  it('includes language codes and front text in prompt', () => {
    const result = service.build({
      front: 'hola',
      targetLanguage: 'es',
      sourceLanguage: 'uk',
    });

    expect(result.prompt).toContain('es');
    expect(result.prompt).toContain('uk');
    expect(result.prompt).toContain('hola');
  });

  it('adds monolingual hint when target equals source', () => {
    const result = service.build({
      front: 'hello',
      targetLanguage: 'en',
      sourceLanguage: 'en',
    });

    expect(result.prompt).toContain('same');
  });
});
