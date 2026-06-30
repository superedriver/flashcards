import { toDeck } from './deck.mapper';

const prismaDeck = {
  id: 'deck-1',
  ownerId: 'owner-1',
  title: 'Spanish Basics',
  description: 'Common words',
  visibility: 'PRIVATE',
  moderationStatus: 'NONE',
  isOfficial: false,
  sourceDeckId: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  deletedAt: null,
};

describe('deck.mapper', () => {
  it('toDeck maps all fields from Prisma record', () => {
    expect(toDeck(prismaDeck)).toEqual({
      id: 'deck-1',
      ownerId: 'owner-1',
      title: 'Spanish Basics',
      description: 'Common words',
      visibility: 'PRIVATE',
      moderationStatus: 'NONE',
      isOfficial: false,
      sourceDeckId: null,
      createdAt: prismaDeck.createdAt,
      updatedAt: prismaDeck.updatedAt,
      deletedAt: null,
    });
  });

  it('toDeck casts visibility and moderationStatus to domain enums', () => {
    const mapped = toDeck({
      ...prismaDeck,
      visibility: 'PUBLIC',
      moderationStatus: 'APPROVED',
    });

    expect(mapped.visibility).toBe('PUBLIC');
    expect(mapped.moderationStatus).toBe('APPROVED');
  });
});
