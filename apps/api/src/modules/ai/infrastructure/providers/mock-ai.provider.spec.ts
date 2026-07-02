import { MockAiProvider } from './mock-ai.provider';

describe('MockAiProvider', () => {
  const provider = new MockAiProvider();

  it('providerName is MOCK', () => {
    expect(provider.providerName).toBe('MOCK');
  });

  it('returns exactly 3 examples', async () => {
    const result = await provider.generateCardExamples({
      front: 'hola',
      back: 'hello',
    });

    expect(result.examples).toHaveLength(3);
  });

  it('uses trimmed front/back in example text', async () => {
    const result = await provider.generateCardExamples({
      front: '  hola  ',
      back: '  hello  ',
    });

    expect(result.examples[0]!.text).toContain('hola');
    expect(result.examples[1]!.text).toContain('hello');
    expect(result.examples[2]!.text).toContain('hola');
    expect(result.examples[2]!.text).toContain('hello');
  });

  it('returns rawOutputPreview', async () => {
    const result = await provider.generateCardExamples({
      front: 'hola',
      back: 'hello',
    });

    expect(result.rawOutputPreview).toBe('mock output');
  });
});
