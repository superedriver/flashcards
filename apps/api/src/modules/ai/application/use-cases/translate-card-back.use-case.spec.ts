import { ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../../auth/domain/types';
import { TranslateCardBackUseCase } from './translate-card-back.use-case';

const safeUser: SafeUser = {
  id: 'user-1',
  email: 'user@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

function createUseCase(options?: {
  user?: SafeUser | null;
  translateResult?: { back: string; rawOutputPreview: string | null };
  translateError?: Error;
}) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const translateCardBack = options?.translateError
    ? jest.fn().mockRejectedValue(options.translateError)
    : jest.fn().mockResolvedValue(
        options?.translateResult ?? {
          back: '[uk] hola',
          rawOutputPreview: 'mock translate',
        },
      );
  const createLog = jest.fn().mockResolvedValue({ id: 'log-1' });

  const useCase = new TranslateCardBackUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
      deleteById: jest.fn(),
    },
    {
      providerName: 'MOCK',
      generateCardExamples: jest.fn(),
      translateCardBack,
      generatePreviewExample: jest.fn(),
    },
    {
      create: createLog,
    },
  );

  return { useCase, translateCardBack, createLog };
}

describe('TranslateCardBackUseCase', () => {
  it('rejects missing user with UNAUTHORIZED', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(
      useCase.execute({
        currentUserId: 'missing',
        front: 'hola',
        targetLanguage: 'es',
        sourceLanguage: 'uk',
        deckId: 'deck-1',
        cardId: 'card-1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.UNAUTHORIZED });
  });

  it('translates card back for es→uk pair via mock provider', async () => {
    const { useCase, translateCardBack } = createUseCase();

    const result = await useCase.execute({
      currentUserId: 'user-1',
      front: 'hola',
      targetLanguage: 'es',
      sourceLanguage: 'uk',
      deckId: 'deck-1',
      cardId: 'card-1',
    });

    expect(translateCardBack).toHaveBeenCalledWith({
      front: 'hola',
      targetLanguage: 'es',
      sourceLanguage: 'uk',
    });
    expect(result).toEqual({
      back: '[uk] hola',
      error: null,
    });
  });

  it('returns safe error for preview UI when provider fails', async () => {
    const { useCase } = createUseCase({
      translateError: new Error('provider unavailable'),
    });

    const result = await useCase.execute({
      currentUserId: 'user-1',
      front: 'hola',
      targetLanguage: 'es',
      sourceLanguage: 'uk',
      deckId: 'deck-1',
      cardId: 'card-1',
    });

    expect(result.back).toBeNull();
    expect(result.error).toBe('Failed to translate card back');
  });

  it('logs AI request on success and failure', async () => {
    const { useCase, createLog } = createUseCase();

    await useCase.execute({
      currentUserId: 'user-1',
      front: 'hola',
      targetLanguage: 'es',
      sourceLanguage: 'uk',
      deckId: 'deck-1',
      cardId: 'card-1',
    });

    expect(createLog).toHaveBeenCalledWith(
      expect.objectContaining({
        feature: 'translate-card-back',
        status: 'SUCCESS',
      }),
    );
  });
});
