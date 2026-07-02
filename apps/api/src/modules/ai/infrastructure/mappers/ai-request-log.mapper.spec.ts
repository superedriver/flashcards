import {
  ERROR_MESSAGE_MAX_LENGTH,
  OUTPUT_PREVIEW_MAX_LENGTH,
  PROMPT_PREVIEW_MAX_LENGTH,
  toAiRequestLog,
  truncateLogText,
} from './ai-request-log.mapper';

const prismaRecord = {
  id: 'log-1',
  userId: 'owner-1',
  deckId: 'deck-1',
  cardId: 'card-1',
  provider: 'MOCK',
  feature: 'generate-card-examples',
  status: 'SUCCESS',
  promptPreview: 'Front: hola',
  outputPreview: 'mock output',
  errorMessage: null,
  createdAt: new Date('2026-06-01T00:00:00.000Z'),
};

describe('ai-request-log.mapper', () => {
  it('toAiRequestLog maps all fields from Prisma record', () => {
    expect(toAiRequestLog(prismaRecord)).toEqual({
      id: 'log-1',
      userId: 'owner-1',
      deckId: 'deck-1',
      cardId: 'card-1',
      provider: 'MOCK',
      feature: 'generate-card-examples',
      status: 'SUCCESS',
      promptPreview: 'Front: hola',
      outputPreview: 'mock output',
      errorMessage: null,
      createdAt: prismaRecord.createdAt,
    });
  });

  it('toAiRequestLog casts provider/status to domain enums', () => {
    const mapped = toAiRequestLog({
      ...prismaRecord,
      provider: 'GEMINI',
      status: 'FAILED',
    });

    expect(mapped.provider).toBe('GEMINI');
    expect(mapped.status).toBe('FAILED');
  });

  it('truncateLogText returns null for null/undefined/whitespace-only input', () => {
    expect(truncateLogText(null, 100)).toBeNull();
    expect(truncateLogText(undefined, 100)).toBeNull();
    expect(truncateLogText('   ', 100)).toBeNull();
  });

  it('truncateLogText returns original text when within limit', () => {
    expect(truncateLogText('hello', 100)).toBe('hello');
  });

  it('truncateLogText truncates text exceeding limit', () => {
    expect(truncateLogText('abcdef', 3)).toBe('abc');
  });

  it('preview max length constants are defined (500/1000)', () => {
    expect(PROMPT_PREVIEW_MAX_LENGTH).toBe(500);
    expect(OUTPUT_PREVIEW_MAX_LENGTH).toBe(1000);
    expect(ERROR_MESSAGE_MAX_LENGTH).toBe(1000);
  });
});
