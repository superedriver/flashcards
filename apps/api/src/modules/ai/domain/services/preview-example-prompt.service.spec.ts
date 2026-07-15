import { PreviewExamplePromptService } from './preview-example-prompt.service';

describe('PreviewExamplePromptService', () => {
  const service = new PreviewExamplePromptService();

  it('includes language codes, front, and back in prompt', () => {
    const result = service.build({
      front: 'hola',
      back: 'привіт',
      targetLanguage: 'es',
      sourceLanguage: 'uk',
    });

    expect(result.prompt).toContain('es');
    expect(result.prompt).toContain('uk');
    expect(result.prompt).toContain('hola');
    expect(result.prompt).toContain('привіт');
    expect(result.prompt).toContain('exactly one');
  });
});
