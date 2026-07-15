import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Card, Deck } from '../../../decks/domain/types';
import { DeckPreviewSession } from '../../domain/types';
import { StartDeckPreviewUseCase } from './start-deck-preview.use-case';
import { UpdateDeckPreviewCardUseCase } from './update-deck-preview-card.use-case';
import { ConfirmDeckPreviewUseCase } from './confirm-deck-preview.use-case';
import { CancelDeckPreviewUseCase } from './cancel-deck-preview.use-case';
import { GetActiveDeckPreviewUseCase } from './get-active-deck-preview.use-case';

const currentUser: AuthUser = {
  id: 'user-1',
  email: 'user@example.com',
  role: 'USER',
};

const safeUser: SafeUser = {
  id: 'user-1',
  email: 'user@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const sourceDeck: Deck = {
  id: 'deck-1',
  ownerId: 'owner-1',
  title: 'Spanish Basics',
  description: null,
  visibility: 'PUBLIC',
  moderationStatus: 'APPROVED',
  isOfficial: true,
  sourceDeckId: null,
  targetLanguage: 'es',
  sourceLanguage: 'en',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

const sourceCards: Card[] = [
  {
    id: 'card-1',
    deckId: 'deck-1',
    front: 'hola',
    back: 'hello',
    example: 'Hello!',
    notes: 'note',
    position: 0,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
  },
];

const now = new Date('2026-01-15T12:00:00.000Z');

function createSession(
  overrides: Partial<DeckPreviewSession> = {},
): DeckPreviewSession {
  return {
    id: 'session-1',
    userId: 'user-1',
    type: 'COPY_PUBLIC',
    status: 'READY',
    sourceDeckId: 'deck-1',
    targetLanguage: 'es',
    chosenSourceLanguage: 'uk',
    cards: [
      {
        sourceCardId: 'card-1',
        front: 'hola',
        back: '[uk] hola',
        example: 'Example: I use "hola" every day.',
      },
    ],
    expiresAt: new Date('2026-01-16T12:00:00.000Z'),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('Deck preview use cases lifecycle', () => {
  it('startPreview rejects same source language for copy flows', async () => {
    const useCase = new StartDeckPreviewUseCase(
      {
        findById: jest.fn().mockResolvedValue(safeUser),
        findByEmail: jest.fn(),
        create: jest.fn(),
        markEmailVerified: jest.fn(),
        updatePasswordHash: jest.fn(),
      },
      {
        create: jest.fn(),
        findById: jest.fn(),
        findByOwner: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
        publish: jest.fn(),
        unpublish: jest.fn(),
        findPublicApprovedById: jest.fn().mockResolvedValue(sourceDeck),
        searchPublicApproved: jest.fn(),
        createCopiedDeck: jest.fn(),
        countByOwnerAndTargetLanguage: jest.fn(),
      },
      {
        create: jest.fn(),
        findById: jest.fn(),
        findByDeckId: jest.fn().mockResolvedValue(sourceCards),
        update: jest.fn(),
        softDelete: jest.fn(),
        softDeleteByDeckId: jest.fn(),
        countByDeckId: jest.fn(),
        createMany: jest.fn(),
      },
      {
        create: jest.fn(),
        findByDeckAndGroup: jest.fn(),
        findActiveGroupsForDeck: jest.fn(),
        findSharedDecksForGroup: jest.fn(),
        userHasAccessToDeck: jest.fn(),
      },
      {
        create: jest.fn(),
        findById: jest.fn(),
        findActiveByUserId: jest.fn().mockResolvedValue(null),
        updateCards: jest.fn(),
        updateStatus: jest.fn(),
        delete: jest.fn(),
        deleteExpiredSessions: jest.fn(),
      },
      { execute: jest.fn() } as never,
      { execute: jest.fn() } as never,
    );

    await expect(
      useCase.execute({
        currentUser,
        type: 'COPY_PUBLIC',
        sourceDeckId: 'deck-1',
        chosenSourceLanguage: 'en',
        now,
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('startPreview creates ready session after generating back then example', async () => {
    const readySession = createSession({ status: 'READY' });
    const creatingSession = createSession({
      status: 'GENERATING',
      cards: [
        {
          sourceCardId: 'card-1',
          front: 'hola',
          back: '',
          example: null,
        },
      ],
    });

    const create = jest.fn().mockResolvedValue(creatingSession);
    const updateCards = jest.fn().mockResolvedValue(creatingSession);
    const updateStatus = jest.fn().mockResolvedValue(readySession);
    const translateExecute = jest.fn().mockResolvedValue({
      back: '[uk] hola',
      error: null,
    });
    const exampleExecute = jest.fn().mockResolvedValue({
      example: 'Example: I use "hola" every day.',
      error: null,
    });

    const useCase = new StartDeckPreviewUseCase(
      {
        findById: jest.fn().mockResolvedValue(safeUser),
        findByEmail: jest.fn(),
        create: jest.fn(),
        markEmailVerified: jest.fn(),
        updatePasswordHash: jest.fn(),
      },
      {
        create: jest.fn(),
        findById: jest.fn(),
        findByOwner: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
        publish: jest.fn(),
        unpublish: jest.fn(),
        findPublicApprovedById: jest.fn().mockResolvedValue(sourceDeck),
        searchPublicApproved: jest.fn(),
        createCopiedDeck: jest.fn(),
        countByOwnerAndTargetLanguage: jest.fn(),
      },
      {
        create: jest.fn(),
        findById: jest.fn(),
        findByDeckId: jest.fn().mockResolvedValue(sourceCards),
        update: jest.fn(),
        softDelete: jest.fn(),
        softDeleteByDeckId: jest.fn(),
        countByDeckId: jest.fn(),
        createMany: jest.fn(),
      },
      {
        create: jest.fn(),
        findByDeckAndGroup: jest.fn(),
        findActiveGroupsForDeck: jest.fn(),
        findSharedDecksForGroup: jest.fn(),
        userHasAccessToDeck: jest.fn(),
      },
      {
        create,
        findById: jest.fn(),
        findActiveByUserId: jest.fn().mockResolvedValue(null),
        updateCards,
        updateStatus,
        delete: jest.fn(),
        deleteExpiredSessions: jest.fn(),
      },
      { execute: translateExecute } as never,
      { execute: exampleExecute } as never,
    );

    const result = await useCase.execute({
      currentUser,
      type: 'COPY_PUBLIC',
      sourceDeckId: 'deck-1',
      chosenSourceLanguage: 'uk',
      now,
    });

    expect(translateExecute).toHaveBeenCalled();
    expect(exampleExecute).toHaveBeenCalled();
    expect(updateStatus).toHaveBeenCalledWith({
      sessionId: 'session-1',
      status: 'READY',
    });
    expect(result.status).toBe('READY');
  });

  it('updatePreviewCard applies manual back/example edits', async () => {
    const session = createSession();
    const updateCards = jest
      .fn()
      .mockImplementation((input: { cards: DeckPreviewSession['cards'] }) =>
        Promise.resolve({
          ...session,
          cards: input.cards,
        }),
      );

    const useCase = new UpdateDeckPreviewCardUseCase(
      {
        findById: jest.fn().mockResolvedValue(safeUser),
        findByEmail: jest.fn(),
        create: jest.fn(),
        markEmailVerified: jest.fn(),
        updatePasswordHash: jest.fn(),
      },
      {
        create: jest.fn(),
        findById: jest.fn().mockResolvedValue(session),
        findActiveByUserId: jest.fn(),
        updateCards,
        updateStatus: jest.fn(),
        delete: jest.fn(),
        deleteExpiredSessions: jest.fn(),
      },
    );

    const result = await useCase.execute({
      currentUserId: 'user-1',
      sessionId: 'session-1',
      cardIndex: 0,
      back: 'привіт',
      example: 'Hola, amigo.',
      now,
    });

    expect(result.cards[0]).toMatchObject({
      back: 'привіт',
      example: 'Hola, amigo.',
    });
  });

  it('confirmPreview creates private deck only for copy flows', async () => {
    const session = createSession();
    const copiedDeck: Deck = {
      ...sourceDeck,
      id: 'copied-1',
      ownerId: 'user-1',
      visibility: 'PRIVATE',
      moderationStatus: 'NONE',
      isOfficial: false,
      sourceDeckId: 'deck-1',
      targetLanguage: null,
      sourceLanguage: null,
    };
    const finalizedDeck: Deck = {
      ...copiedDeck,
      targetLanguage: 'es',
      sourceLanguage: 'uk',
    };

    const createCopiedDeck = jest.fn().mockResolvedValue(copiedDeck);
    const update = jest.fn().mockResolvedValue(finalizedDeck);
    const createMany = jest.fn().mockResolvedValue([
      {
        ...sourceCards[0],
        id: 'new-card-1',
        deckId: 'copied-1',
        back: '[uk] hola',
        notes: null,
      },
    ]);
    const upsert = jest.fn();
    const deleteSession = jest.fn();

    const useCase = new ConfirmDeckPreviewUseCase(
      {
        findById: jest.fn().mockResolvedValue(safeUser),
        findByEmail: jest.fn(),
        create: jest.fn(),
        markEmailVerified: jest.fn(),
        updatePasswordHash: jest.fn(),
      },
      {
        create: jest.fn(),
        findById: jest.fn().mockResolvedValue(sourceDeck),
        findByOwner: jest.fn(),
        update,
        softDelete: jest.fn(),
        publish: jest.fn(),
        unpublish: jest.fn(),
        findPublicApprovedById: jest.fn(),
        searchPublicApproved: jest.fn(),
        createCopiedDeck,
        countByOwnerAndTargetLanguage: jest.fn(),
      },
      {
        create: jest.fn(),
        findById: jest.fn(),
        findByDeckId: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
        softDeleteByDeckId: jest.fn(),
        countByDeckId: jest.fn(),
        createMany,
      },
      {
        create: jest.fn(),
        findById: jest.fn().mockResolvedValue(session),
        findActiveByUserId: jest.fn(),
        updateCards: jest.fn(),
        updateStatus: jest.fn(),
        delete: deleteSession,
        deleteExpiredSessions: jest.fn(),
      },
      {
        findByUserId: jest.fn(),
        findByUserIdAndCode: jest.fn(),
        upsert,
        delete: jest.fn(),
      },
    );

    const result = await useCase.execute({
      currentUser,
      sessionId: 'session-1',
      now,
    });

    expect(createCopiedDeck).toHaveBeenCalled();
    expect(createMany).toHaveBeenCalled();
    expect(upsert).toHaveBeenCalledWith('user-1', 'es');
    expect(deleteSession).toHaveBeenCalledWith('session-1');
    expect(result.deck.id).toBe('copied-1');
  });

  it('confirmPreview regenerates cards without recreating deck', async () => {
    const ownedDeck: Deck = {
      ...sourceDeck,
      ownerId: 'user-1',
      visibility: 'PRIVATE',
      moderationStatus: 'NONE',
      isOfficial: false,
    };
    const session = createSession({
      type: 'REGENERATE_DECK',
      sourceDeckId: ownedDeck.id,
    });
    const updateCard = jest.fn().mockResolvedValue({
      ...sourceCards[0],
      back: '[uk] hola',
      example: 'Example: I use "hola" every day.',
    });
    const createCopiedDeck = jest.fn();

    const useCase = new ConfirmDeckPreviewUseCase(
      {
        findById: jest.fn().mockResolvedValue(safeUser),
        findByEmail: jest.fn(),
        create: jest.fn(),
        markEmailVerified: jest.fn(),
        updatePasswordHash: jest.fn(),
      },
      {
        create: jest.fn(),
        findById: jest.fn().mockResolvedValue(ownedDeck),
        findByOwner: jest.fn(),
        update: jest.fn().mockResolvedValue({
          ...ownedDeck,
          sourceLanguage: 'uk',
        }),
        softDelete: jest.fn(),
        publish: jest.fn(),
        unpublish: jest.fn(),
        findPublicApprovedById: jest.fn(),
        searchPublicApproved: jest.fn(),
        createCopiedDeck,
        countByOwnerAndTargetLanguage: jest.fn(),
      },
      {
        create: jest.fn(),
        findById: jest.fn(),
        findByDeckId: jest.fn(),
        update: updateCard,
        softDelete: jest.fn(),
        softDeleteByDeckId: jest.fn(),
        countByDeckId: jest.fn(),
        createMany: jest.fn(),
      },
      {
        create: jest.fn(),
        findById: jest.fn().mockResolvedValue(session),
        findActiveByUserId: jest.fn(),
        updateCards: jest.fn(),
        updateStatus: jest.fn(),
        delete: jest.fn(),
        deleteExpiredSessions: jest.fn(),
      },
      {
        findByUserId: jest.fn(),
        findByUserIdAndCode: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
      },
    );

    await useCase.execute({
      currentUser,
      sessionId: 'session-1',
      now,
    });

    expect(createCopiedDeck).not.toHaveBeenCalled();
    expect(updateCard).toHaveBeenCalledWith({
      cardId: 'card-1',
      back: '[uk] hola',
      example: 'Example: I use "hola" every day.',
    });
  });

  it('cancelPreview deletes session and getActivePreview returns null afterward', async () => {
    const session = createSession();
    const deleteSession = jest.fn();
    const findActiveByUserId = jest
      .fn()
      .mockResolvedValueOnce(session)
      .mockResolvedValueOnce(null);

    const cancelUseCase = new CancelDeckPreviewUseCase(
      {
        findById: jest.fn().mockResolvedValue(safeUser),
        findByEmail: jest.fn(),
        create: jest.fn(),
        markEmailVerified: jest.fn(),
        updatePasswordHash: jest.fn(),
      },
      {
        create: jest.fn(),
        findById: jest.fn().mockResolvedValue(session),
        findActiveByUserId,
        updateCards: jest.fn(),
        updateStatus: jest.fn(),
        delete: deleteSession,
        deleteExpiredSessions: jest.fn(),
      },
    );

    const getActiveUseCase = new GetActiveDeckPreviewUseCase(
      {
        findById: jest.fn().mockResolvedValue(safeUser),
        findByEmail: jest.fn(),
        create: jest.fn(),
        markEmailVerified: jest.fn(),
        updatePasswordHash: jest.fn(),
      },
      {
        create: jest.fn(),
        findById: jest.fn(),
        findActiveByUserId,
        updateCards: jest.fn(),
        updateStatus: jest.fn(),
        delete: jest.fn(),
        deleteExpiredSessions: jest.fn(),
      },
    );

    await expect(
      getActiveUseCase.execute({ currentUserId: 'user-1', now }),
    ).resolves.toEqual(session);

    await expect(
      cancelUseCase.execute({
        currentUserId: 'user-1',
        sessionId: 'session-1',
      }),
    ).resolves.toBe(true);

    expect(deleteSession).toHaveBeenCalledWith('session-1');

    await expect(
      getActiveUseCase.execute({ currentUserId: 'user-1', now }),
    ).resolves.toBeNull();
  });
});
