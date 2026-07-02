import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Card, Deck } from '../../../decks/domain/types';
import {
  AiProviderPort,
  GenerateCardExamplesResult,
} from '../ports/ai-provider.port';
import { CreateAiRequestLogInput } from '../ports/ai-request-log-repository.port';
import { AiRequestLog } from '../../domain/types/ai-request-log.type';
import { GenerateCardExamplesUseCase } from './generate-card-examples.use-case';

const owner: AuthUser = {
  id: 'owner-1',
  email: 'owner@example.com',
  role: 'USER',
};

const safeUser: SafeUser = {
  id: 'owner-1',
  email: 'owner@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const deck: Deck = {
  id: 'deck-1',
  ownerId: 'owner-1',
  title: 'Spanish Basics',
  description: null,
  visibility: 'PRIVATE',
  moderationStatus: 'NONE',
  isOfficial: false,
  sourceDeckId: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

const card: Card = {
  id: 'card-1',
  deckId: 'deck-1',
  front: 'hola',
  back: 'hello',
  example: null,
  notes: 'greeting',
  position: 0,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

const aiResult: GenerateCardExamplesResult = {
  examples: [
    { text: 'Example one' },
    { text: 'Example two' },
    { text: 'Example three' },
  ],
  rawOutputPreview: 'preview text',
};

function createUseCase(options?: {
  user?: SafeUser | null;
  card?: Card | null;
  deck?: Deck | null;
  aiProvider?: Partial<AiProviderPort>;
}) {
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findCardById = jest
    .fn()
    .mockResolvedValue(options?.card === undefined ? card : options.card);
  const findDeckById = jest
    .fn()
    .mockResolvedValue(options?.deck === undefined ? deck : options.deck);
  const updateCard = jest.fn();
  const generateCardExamples = jest.fn().mockResolvedValue(aiResult);
  const createLog = jest
    .fn<Promise<AiRequestLog>, [CreateAiRequestLogInput]>()
    .mockResolvedValue({
      id: 'log-1',
      userId: 'owner-1',
      deckId: 'deck-1',
      cardId: 'card-1',
      provider: 'MOCK',
      feature: 'generate-card-examples',
      status: 'SUCCESS',
      promptPreview: null,
      outputPreview: null,
      errorMessage: null,
      createdAt: new Date('2026-06-01T00:00:00.000Z'),
    });

  const aiProvider: AiProviderPort = {
    providerName: 'MOCK',
    generateCardExamples,
    ...options?.aiProvider,
  };

  const useCase = new GenerateCardExamplesUseCase(
    {
      findById: findByIdUser,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      findById: findCardById,
      create: jest.fn(),
      update: updateCard,
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      countByDeckId: jest.fn(),
      createMany: jest.fn(),
      findByDeckId: jest.fn(),
    },
    {
      findById: findDeckById,
      findByOwner: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      publish: jest.fn(),
      unpublish: jest.fn(),
      findPublicApprovedById: jest.fn(),
      searchPublicApproved: jest.fn(),
      createCopiedDeck: jest.fn(),
      create: jest.fn(),
    },
    aiProvider,
    { create: createLog },
  );

  return {
    useCase,
    generateCardExamples,
    createLog,
    updateCard,
  };
}

describe('GenerateCardExamplesUseCase', () => {
  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({ currentUser: owner, cardId: 'card-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws CARD_NOT_FOUND when card is missing', async () => {
    const { useCase } = createUseCase({ card: null });

    await expect(
      useCase.execute({ currentUser: owner, cardId: 'missing' }),
    ).rejects.toMatchObject({ code: ErrorCodes.CARD_NOT_FOUND });
  });

  it('throws DECK_NOT_FOUND when deck is missing', async () => {
    const { useCase } = createUseCase({ deck: null });

    await expect(
      useCase.execute({ currentUser: owner, cardId: 'card-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('throws CARD_FORBIDDEN for non-owner (canManageCard)', async () => {
    const { useCase } = createUseCase({
      deck: { ...deck, ownerId: 'other-user' },
    });

    await expect(
      useCase.execute({ currentUser: owner, cardId: 'card-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.CARD_FORBIDDEN });
  });

  it('calls AiProviderPort.generateCardExamples with card context', async () => {
    const { useCase, generateCardExamples } = createUseCase();

    await useCase.execute({
      currentUser: owner,
      cardId: 'card-1',
      locale: 'uk',
    });

    expect(generateCardExamples).toHaveBeenCalledWith({
      front: 'hola',
      back: 'hello',
      existingExample: null,
      notes: 'greeting',
      locale: 'uk',
    });
  });

  it('logs SUCCESS AI request with safe previews', async () => {
    const { useCase, createLog } = createUseCase();

    await useCase.execute({ currentUser: owner, cardId: 'card-1' });

    const logInput = createLog.mock.calls[0]![0];

    expect(logInput).toMatchObject({
      userId: 'owner-1',
      deckId: 'deck-1',
      cardId: 'card-1',
      provider: 'MOCK',
      feature: 'generate-card-examples',
      status: 'SUCCESS',
      outputPreview: 'preview text',
    });
    expect(logInput.promptPreview).toContain('Front: hola');
    expect(logInput.promptPreview).not.toContain('AI_API_KEY');
  });

  it('returns cardId and examples', async () => {
    const { useCase } = createUseCase();

    const result = await useCase.execute({
      currentUser: owner,
      cardId: 'card-1',
    });

    expect(result).toEqual({
      cardId: 'card-1',
      examples: aiResult.examples,
    });
  });

  it('does not update card.example during generation', async () => {
    const { useCase, updateCard } = createUseCase();

    await useCase.execute({ currentUser: owner, cardId: 'card-1' });

    expect(updateCard).not.toHaveBeenCalled();
  });

  it('logs FAILED AI request when provider throws', async () => {
    const { useCase, createLog } = createUseCase({
      aiProvider: {
        generateCardExamples: jest
          .fn()
          .mockRejectedValue(
            new ApplicationError(
              ErrorCodes.INTERNAL_ERROR,
              'Failed to generate card examples',
            ),
          ),
      },
    });

    await expect(
      useCase.execute({ currentUser: owner, cardId: 'card-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.INTERNAL_ERROR });

    const logInput = createLog.mock.calls[0]![0];

    expect(logInput).toMatchObject({
      status: 'FAILED',
      errorMessage: 'Failed to generate card examples',
    });
  });

  it('rethrows ApplicationError from provider without exposing secrets', async () => {
    const { useCase } = createUseCase({
      aiProvider: {
        generateCardExamples: jest
          .fn()
          .mockRejectedValue(
            new ApplicationError(
              ErrorCodes.VALIDATION_ERROR,
              'AI provider is not configured',
            ),
          ),
      },
    });

    await expect(
      useCase.execute({ currentUser: owner, cardId: 'card-1' }),
    ).rejects.toMatchObject({
      code: ErrorCodes.VALIDATION_ERROR,
      message: 'AI provider is not configured',
    });
  });
});
