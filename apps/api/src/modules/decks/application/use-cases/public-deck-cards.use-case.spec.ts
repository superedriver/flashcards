import { ErrorCodes } from '../../../../common/errors';
import { Card, Deck } from '../../domain/types';
import { PublicDeckCardsUseCase } from './public-deck-cards.use-case';

const publicDeck: Deck = {
  id: 'deck-1',
  ownerId: 'owner-1',
  title: 'Public Deck',
  description: null,
  visibility: 'PUBLIC',
  moderationStatus: 'APPROVED',
  isOfficial: false,
  sourceDeckId: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

const cards: Card[] = [
  {
    id: 'card-1',
    deckId: 'deck-1',
    front: 'apple',
    back: 'яблуко',
    example: null,
    notes: null,
    position: 0,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
  },
];

function createUseCase(deck: Deck | null) {
  const findByDeckId = jest.fn().mockResolvedValue(cards);

  const useCase = new PublicDeckCardsUseCase(
    {
      create: jest.fn(),
      findById: jest.fn(),
      findByOwner: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      publish: jest.fn(),
      unpublish: jest.fn(),
      findPublicApprovedById: jest.fn().mockResolvedValue(deck),
      searchPublicApproved: jest.fn(),
      createCopiedDeck: jest.fn(),
    },
    {
      create: jest.fn(),
      findById: jest.fn(),
      findByDeckId,
      update: jest.fn(),
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      countByDeckId: jest.fn(),
      createMany: jest.fn(),
    },
  );

  return { useCase, findByDeckId };
}

describe('PublicDeckCardsUseCase', () => {
  it('throws DECK_NOT_FOUND when findPublicApprovedById returns null', async () => {
    const { useCase, findByDeckId } = createUseCase(null);

    await expect(useCase.execute({ deckId: 'deck-1' })).rejects.toMatchObject({
      code: ErrorCodes.DECK_NOT_FOUND,
    });

    expect(findByDeckId).not.toHaveBeenCalled();
  });

  it('returns cards from findByDeckId for public approved deck', async () => {
    const { useCase, findByDeckId } = createUseCase(publicDeck);

    await expect(useCase.execute({ deckId: 'deck-1' })).resolves.toEqual(cards);

    expect(findByDeckId).toHaveBeenCalledWith('deck-1');
  });
});
