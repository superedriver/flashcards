import { ErrorCodes } from '../../../../common/errors';
import { Deck } from '../../domain/types';
import { PublicDeckUseCase } from './public-deck.use-case';

const publicDeck: Deck = {
  id: 'deck-1',
  ownerId: 'owner-1',
  title: 'Public Deck',
  description: 'Description',
  visibility: 'PUBLIC',
  moderationStatus: 'APPROVED',
  isOfficial: false,
  sourceDeckId: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

function createUseCase(deck: Deck | null) {
  const findById = jest.fn();
  const findPublicApprovedById = jest.fn().mockResolvedValue(deck);

  const useCase = new PublicDeckUseCase({
    create: jest.fn(),
    findById,
    findByOwner: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    publish: jest.fn(),
    unpublish: jest.fn(),
    findPublicApprovedById,
    searchPublicApproved: jest.fn(),
    createCopiedDeck: jest.fn(),
  });

  return { useCase, findById, findPublicApprovedById };
}

describe('PublicDeckUseCase', () => {
  it('throws DECK_NOT_FOUND when findPublicApprovedById returns null', async () => {
    const { useCase } = createUseCase(null);

    await expect(useCase.execute({ deckId: 'deck-1' })).rejects.toMatchObject({
      code: ErrorCodes.DECK_NOT_FOUND,
    });
  });

  it('returns public approved deck when found', async () => {
    const { useCase } = createUseCase(publicDeck);

    await expect(useCase.execute({ deckId: 'deck-1' })).resolves.toEqual(
      publicDeck,
    );
  });

  it('does not call findById (only public approved lookup)', async () => {
    const { useCase, findById } = createUseCase(publicDeck);

    await useCase.execute({ deckId: 'deck-1' });

    expect(findById).not.toHaveBeenCalled();
  });
});
