import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Card, Deck } from '../../../decks/domain/types';
import { CardReviewState, StudySession } from '../../domain/types';
import { DisableAudioOnlyUseCase } from './disable-audio-only.use-case';

const authUser: AuthUser = {
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

const ownedDeck: Deck = {
  id: 'deck-1',
  ownerId: 'owner-1',
  title: 'Spanish',
  description: null,
  visibility: 'PRIVATE',
  moderationStatus: 'NONE',
  isOfficial: false,
  sourceDeckId: null,
  targetLanguage: 'es',
  sourceLanguage: 'en',
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
  notes: null,
  position: 1,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

const reviewState: CardReviewState = {
  id: 'review-1',
  userId: 'owner-1',
  cardId: 'card-1',
  learningStep: 6,
  longReviewSuccessCount: 0,
  dueAt: new Date('2026-06-01T12:00:00.000Z'),
  lastReviewedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const activeSession: StudySession = {
  id: 'session-1',
  userId: 'owner-1',
  deckId: 'deck-1',
  scope: 'DECK',
  status: 'ACTIVE',
  lessonSize: 0,
  snapshotCardIds: [],
  queueState: null,
  audioOnlyDisabled: false,
  startedAt: new Date('2026-06-01T00:00:00.000Z'),
  completedAt: null,
  abandonedAt: null,
  createdAt: new Date('2026-06-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
};

function createUseCase(options?: {
  user?: SafeUser | null;
  session?: StudySession | null;
  card?: Card | null;
  reviewState?: CardReviewState | null;
}) {
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findSessionById = jest
    .fn()
    .mockResolvedValue(
      options?.session === undefined ? activeSession : options.session,
    );
  const findCardById = jest
    .fn()
    .mockResolvedValue(options?.card === undefined ? card : options.card);
  const findByUserAndCard = jest
    .fn()
    .mockResolvedValue(
      options?.reviewState === undefined ? reviewState : options.reviewState,
    );
  const updateAudioOnlyDisabled = jest.fn().mockResolvedValue({
    ...activeSession,
    audioOnlyDisabled: true,
  });
  const createReview = jest.fn();
  const updateSession = jest.fn();

  const useCase = new DisableAudioOnlyUseCase(
    {
      findById: findByIdUser,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      findById: findCardById,
      findByDeckId: jest.fn(),
      countByDeckId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      createMany: jest.fn(),
      findLiveDuplicatesForOwner: jest.fn(),
    },
    {
      create: jest.fn(),
      findById: jest.fn().mockResolvedValue(ownedDeck),
      findByOwner: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      publish: jest.fn(),
      unpublish: jest.fn(),
      findPublicApprovedById: jest.fn(),
      searchPublicApproved: jest.fn(),
      createCopiedDeck: jest.fn(),
      countByOwnerAndTargetLanguage: jest.fn(),
    },
    {
      findByUserAndCard,
      findDueCardIdsForDeck: jest.fn(),
      findDueCardIdsForOwnDecksWithTargetLanguage: jest.fn(),
      findDueCandidatesForDeck: jest.fn(),
      findDueCandidatesForOwnDecksWithTargetLanguage: jest.fn(),
      countReviewedForDeck: jest.fn(),
      countDueForDeck: jest.fn(),
      countDueForUser: jest.fn(),
      countDueForOwnDecksWithTargetLanguage: jest.fn(),
      countLearningGroupsForDeck: jest.fn(),
      countLearningGroupsForOwnDecksWithTargetLanguage: jest.fn(),
      findNextDueAtForDeck: jest.fn(),
      createInitialIfMissing: jest.fn(),
      createInitialMany: jest.fn(),
      upsert: jest.fn(),
    },
    {
      abandonActiveForUserAndDeck: jest.fn(),
      abandonActiveForUser: jest.fn(),
      create: jest.fn(),
      update: updateSession,
      findById: findSessionById,
      createReview,
      hasReviewForCard: jest.fn(),
      countReviews: jest.fn(),
      countReviewsByAnswer: jest.fn(),
      complete: jest.fn(),
      abandon: jest.fn(),
      updateAudioOnlyDisabled,
    },
  );

  return {
    useCase,
    updateAudioOnlyDisabled,
    createReview,
    updateSession,
  };
}

describe('DisableAudioOnlyUseCase', () => {
  it('sets the session flag and returns TARGET_TEXT for the current card', async () => {
    const { useCase, updateAudioOnlyDisabled, createReview, updateSession } =
      createUseCase();

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
    });

    expect(updateAudioOnlyDisabled).toHaveBeenCalledWith({
      sessionId: 'session-1',
      audioOnlyDisabled: true,
    });
    expect(createReview).not.toHaveBeenCalled();
    expect(updateSession).not.toHaveBeenCalled();
    expect(result.cardId).toBe('card-1');
    expect(result.learningStep).toBe(6);
    expect(result.presentationMode).toBe('TARGET_TEXT');
    expect(result.reviewState).toEqual(reviewState);
  });

  it('is idempotent when audioOnlyDisabled is already true', async () => {
    const { useCase, updateAudioOnlyDisabled } = createUseCase({
      session: { ...activeSession, audioOnlyDisabled: true },
    });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
    });

    expect(updateAudioOnlyDisabled).not.toHaveBeenCalled();
    expect(result.presentationMode).toBe('TARGET_TEXT');
  });

  it('throws LESSON_NOT_FOUND when session belongs to another user', async () => {
    const { useCase } = createUseCase({
      session: { ...activeSession, userId: 'other-user' },
    });

    await expect(
      useCase.execute({
        currentUser: authUser,
        sessionId: 'session-1',
        cardId: 'card-1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.LESSON_NOT_FOUND });
  });

  it('throws LESSON_NOT_ACTIVE when session is completed', async () => {
    const { useCase } = createUseCase({
      session: { ...activeSession, status: 'COMPLETED' },
    });

    await expect(
      useCase.execute({
        currentUser: authUser,
        sessionId: 'session-1',
        cardId: 'card-1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.LESSON_NOT_ACTIVE });
  });

  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({
        currentUser: authUser,
        sessionId: 'session-1',
        cardId: 'card-1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });
});
