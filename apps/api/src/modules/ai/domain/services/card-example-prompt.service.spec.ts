import { CardExamplePromptService } from './card-example-prompt.service';

describe('CardExamplePromptService', () => {
  const service = new CardExamplePromptService();

  it('includes front and back in prompt', () => {
    const result = service.build({ front: 'hola', back: 'hello' });

    expect(result.prompt).toContain('Front: hola');
    expect(result.prompt).toContain('Back: hello');
  });

  it('includes existing example when provided', () => {
    const result = service.build({
      front: 'hola',
      back: 'hello',
      existingExample: 'Hola, ¿cómo estás?',
    });

    expect(result.prompt).toContain('Existing example: Hola, ¿cómo estás?');
  });

  it('includes notes when provided', () => {
    const result = service.build({
      front: 'hola',
      back: 'hello',
      notes: 'Common greeting',
    });

    expect(result.prompt).toContain('Notes: Common greeting');
  });

  it('includes locale when provided', () => {
    const result = service.build({
      front: 'hola',
      back: 'hello',
      locale: 'uk',
    });

    expect(result.prompt).toContain('Preferred language/locale: uk');
  });

  it('omits optional sections when empty/null', () => {
    const result = service.build({
      front: 'hola',
      back: 'hello',
      existingExample: null,
      notes: '   ',
      locale: '',
    });

    expect(result.prompt).not.toContain('Existing example:');
    expect(result.prompt).not.toContain('Notes:');
    expect(result.prompt).not.toContain('Preferred language/locale:');
  });

  it('bounds prompt to max length 4000', () => {
    const result = service.build({
      front: 'x'.repeat(3000),
      back: 'y'.repeat(3000),
    });

    expect(result.prompt.length).toBe(4000);
  });
});
