import { ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../../auth/domain/types';
import { GeneratePreviewExampleUseCase } from './generate-preview-example.use-case';

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
  generateResult?: { example: string; rawOutputPreview: string | null };
  generateError?: Error;
}) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const generatePreviewExample = options?.generateError
    ? jest.fn().mockRejectedValue(options.generateError)
    : jest.fn().mockResolvedValue(
        options?.generateResult ?? {
          example: 'Ejemplo: uso hola cada día.',
          rawOutputPreview: 'mock preview example',
        },
      );
  const createLog = jest.fn().mockResolvedValue({ id: 'log-1' });

  const useCase = new GeneratePreviewExampleUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      providerName: 'MOCK',
      generateCardExamples: jest.fn(),
      translateCardBack: jest.fn(),
      generatePreviewExample,
    },
    {
      create: createLog,
    },
  );

  return { useCase, generatePreviewExample, createLog };
}

describe('GeneratePreviewExampleUseCase', () => {
  it('rejects missing user with UNAUTHORIZED', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(
      useCase.execute({
        currentUserId: 'missing',
        front: 'hola',
        back: 'привіт',
        targetLanguage: 'es',
        sourceLanguage: 'uk',
        deckId: 'deck-1',
        cardId: 'card-1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.UNAUTHORIZED });
  });

  it('generates a single example after back is available', async () => {
    const { useCase, generatePreviewExample } = createUseCase();

    const result = await useCase.execute({
      currentUserId: 'user-1',
      front: 'hola',
      back: 'привіт',
      targetLanguage: 'es',
      sourceLanguage: 'uk',
      deckId: 'deck-1',
      cardId: 'card-1',
    });

    expect(generatePreviewExample).toHaveBeenCalledWith({
      front: 'hola',
      back: 'привіт',
      targetLanguage: 'es',
      sourceLanguage: 'uk',
    });
    expect(result).toEqual({
      example: 'Ejemplo: uso hola cada día.',
      error: null,
    });
  });

  it('returns empty example and error when provider fails', async () => {
    const { useCase } = createUseCase({
      generateError: new Error('provider unavailable'),
    });

    const result = await useCase.execute({
      currentUserId: 'user-1',
      front: 'hola',
      back: 'привіт',
      targetLanguage: 'es',
      sourceLanguage: 'uk',
      deckId: 'deck-1',
      cardId: 'card-1',
    });

    expect(result.example).toBeNull();
    expect(result.error).toBe('Failed to generate preview example');
  });

  it('rejects empty back with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUserId: 'user-1',
        front: 'hola',
        back: '   ',
        targetLanguage: 'es',
        sourceLanguage: 'uk',
        deckId: 'deck-1',
        cardId: 'card-1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });
});
