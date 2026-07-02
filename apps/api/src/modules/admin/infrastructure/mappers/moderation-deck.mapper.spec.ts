import { toModerationDeck } from './moderation-deck.mapper';

const prismaDeck = {
  id: 'deck-1',
  ownerId: 'owner-1',
  title: 'Spanish Basics',
  description: 'Beginner deck',
  visibility: 'PUBLIC',
  moderationStatus: 'PENDING',
  isOfficial: false,
  sourceDeckId: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  deletedAt: null,
  owner: {
    email: 'owner@example.com',
  },
  _count: {
    cards: 12,
  },
};

describe('moderation-deck.mapper', () => {
  it('toModerationDeck maps deck fields from Prisma record', () => {
    expect(toModerationDeck(prismaDeck)).toMatchObject({
      id: 'deck-1',
      ownerId: 'owner-1',
      title: 'Spanish Basics',
      description: 'Beginner deck',
      isOfficial: false,
      sourceDeckId: null,
      createdAt: prismaDeck.createdAt,
      updatedAt: prismaDeck.updatedAt,
      deletedAt: null,
    });
  });

  it('toModerationDeck maps ownerEmail from joined owner', () => {
    expect(toModerationDeck(prismaDeck).ownerEmail).toBe('owner@example.com');
  });

  it('toModerationDeck maps cardCount from _count.cards', () => {
    expect(toModerationDeck(prismaDeck).cardCount).toBe(12);
  });

  it('toModerationDeck casts visibility and moderationStatus enums', () => {
    const mapped = toModerationDeck({
      ...prismaDeck,
      visibility: 'PRIVATE',
      moderationStatus: 'APPROVED',
    });

    expect(mapped.visibility).toBe('PRIVATE');
    expect(mapped.moderationStatus).toBe('APPROVED');
  });
});
