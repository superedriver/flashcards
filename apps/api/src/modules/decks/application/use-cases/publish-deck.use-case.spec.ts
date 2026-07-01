import { ErrorCodes } from '../../../../common/errors';
import { AuthUser } from '../../../auth/domain/types';
import { Deck } from '../../domain/types';
import { PublishDeckUseCase } from './publish-deck.use-case';

const owner: AuthUser = {
  id: 'owner-1',
  email: 'owner@example.com',
  role: 'USER',
};

const otherUser: AuthUser = {
  id: 'other-1',
  email: 'other@example.com',
  role: 'USER',
};

function createDeck(overrides: Partial<Deck> = {}): Deck {
  return {
    id: 'deck-1',
    ownerId: 'owner-1',
    title: 'Test Deck',
    description: null,
    visibility: 'PRIVATE',
    moderationStatus: 'NONE',
    isOfficial: false,
    sourceDeckId: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  };
}

function createUseCase(deck: Deck | null, cardCount = 1) {
  const publish = jest
    .fn()
    .mockResolvedValue(
      createDeck({ visibility: 'PUBLIC', moderationStatus: 'APPROVED' }),
    );
  const countByDeckId = jest.fn().mockResolvedValue(cardCount);

  const useCase = new PublishDeckUseCase(
    {
      create: jest.fn(),
      findById: jest.fn().mockResolvedValue(deck),
      findByOwner: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      publish,
      unpublish: jest.fn(),
      findPublicApprovedById: jest.fn(),
      searchPublicApproved: jest.fn(),
      createCopiedDeck: jest.fn(),
    },
    {
      create: jest.fn(),
      findById: jest.fn(),
      findByDeckId: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      countByDeckId,
      createMany: jest.fn(),
    },
  );

  return { useCase, publish, countByDeckId };
}

describe('PublishDeckUseCase', () => {
  it('throws DECK_NOT_FOUND when deck is missing', async () => {
    const { useCase } = createUseCase(null);

    await expect(
      useCase.execute({ currentUser: owner, deckId: 'missing' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('throws DECK_FORBIDDEN for non-owner', async () => {
    const { useCase } = createUseCase(createDeck());

    await expect(
      useCase.execute({ currentUser: otherUser, deckId: 'deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_FORBIDDEN });
  });

  it('throws VALIDATION_ERROR when deck has zero cards', async () => {
    const { useCase, publish } = createUseCase(createDeck(), 0);

    await expect(
      useCase.execute({ currentUser: owner, deckId: 'deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });

    expect(publish).not.toHaveBeenCalled();
  });

  it('owner can publish non-empty deck', async () => {
    const { useCase } = createUseCase(createDeck(), 2);

    const result = await useCase.execute({
      currentUser: owner,
      deckId: 'deck-1',
    });

    expect(result.visibility).toBe('PUBLIC');
    expect(result.moderationStatus).toBe('APPROVED');
  });

  it('calls deckRepository.publish with deckId', async () => {
    const { useCase, publish } = createUseCase(createDeck());

    await useCase.execute({ currentUser: owner, deckId: 'deck-1' });

    expect(publish).toHaveBeenCalledWith({ deckId: 'deck-1' });
  });
});
