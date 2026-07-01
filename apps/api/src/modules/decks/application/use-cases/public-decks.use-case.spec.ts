import { Deck } from '../../domain/types';
import { PublicDecksUseCase } from './public-decks.use-case';

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

function createUseCase() {
  const searchPublicApproved = jest.fn().mockResolvedValue({
    items: [publicDeck],
    total: 1,
  });

  const useCase = new PublicDecksUseCase({
    create: jest.fn(),
    findById: jest.fn(),
    findByOwner: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    publish: jest.fn(),
    unpublish: jest.fn(),
    findPublicApprovedById: jest.fn(),
    searchPublicApproved,
    createCopiedDeck: jest.fn(),
  });

  return { useCase, searchPublicApproved };
}

describe('PublicDecksUseCase', () => {
  it('default limit is 20 when limit is omitted', async () => {
    const { useCase, searchPublicApproved } = createUseCase();

    await useCase.execute({});

    expect(searchPublicApproved).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 20 }),
    );
  });

  it('default offset is 0 when offset is omitted', async () => {
    const { useCase, searchPublicApproved } = createUseCase();

    await useCase.execute({});

    expect(searchPublicApproved).toHaveBeenCalledWith(
      expect.objectContaining({ offset: 0 }),
    );
  });

  it('clamps limit to minimum 1', async () => {
    const { useCase, searchPublicApproved } = createUseCase();

    await useCase.execute({ limit: 0 });

    expect(searchPublicApproved).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 1 }),
    );
  });

  it('clamps limit to maximum 50', async () => {
    const { useCase, searchPublicApproved } = createUseCase();

    await useCase.execute({ limit: 100 });

    expect(searchPublicApproved).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 50 }),
    );
  });

  it('normalizes negative offset to 0', async () => {
    const { useCase, searchPublicApproved } = createUseCase();

    await useCase.execute({ offset: -5 });

    expect(searchPublicApproved).toHaveBeenCalledWith(
      expect.objectContaining({ offset: 0 }),
    );
  });

  it('trims query and passes null when query is empty/whitespace', async () => {
    const { useCase, searchPublicApproved } = createUseCase();

    await useCase.execute({ query: '   ' });

    expect(searchPublicApproved).toHaveBeenCalledWith(
      expect.objectContaining({ query: null }),
    );
  });

  it('passes normalized query/limit/offset to searchPublicApproved', async () => {
    const { useCase, searchPublicApproved } = createUseCase();

    await useCase.execute({ query: '  hello  ', limit: 10, offset: 5 });

    expect(searchPublicApproved).toHaveBeenCalledWith({
      query: 'hello',
      limit: 10,
      offset: 5,
    });
  });

  it('returns items and total from repository', async () => {
    const { useCase } = createUseCase();

    await expect(useCase.execute({})).resolves.toEqual({
      items: [publicDeck],
      total: 1,
    });
  });
});
