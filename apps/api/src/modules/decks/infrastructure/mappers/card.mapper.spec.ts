import { toCard } from './card.mapper';

const prismaCard = {
  id: 'card-1',
  deckId: 'deck-1',
  front: 'hola',
  back: 'hello',
  example: 'Hola!',
  notes: null,
  position: 0,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  deletedAt: null,
};

describe('card.mapper', () => {
  it('toCard maps all fields from Prisma record', () => {
    expect(toCard(prismaCard)).toEqual({
      id: 'card-1',
      deckId: 'deck-1',
      front: 'hola',
      back: 'hello',
      example: 'Hola!',
      notes: null,
      position: 0,
      createdAt: prismaCard.createdAt,
      updatedAt: prismaCard.updatedAt,
      deletedAt: null,
    });
  });
});
