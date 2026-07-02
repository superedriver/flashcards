import { toDeckGroupShare } from './deck-group-share.mapper';

const prismaShare = {
  id: 'share-1',
  deckId: 'deck-1',
  groupId: 'group-1',
  permission: 'VIEW',
  createdById: 'user-1',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  deletedAt: null,
};

describe('deck-group-share.mapper', () => {
  it('toDeckGroupShare maps permission and soft-delete fields', () => {
    expect(toDeckGroupShare(prismaShare)).toEqual({
      id: 'share-1',
      deckId: 'deck-1',
      groupId: 'group-1',
      permission: 'VIEW',
      createdById: 'user-1',
      createdAt: prismaShare.createdAt,
      updatedAt: prismaShare.updatedAt,
      deletedAt: null,
    });
  });

  it('toDeckGroupShare maps deletedAt when set', () => {
    const deletedAt = new Date('2026-06-15T00:00:00.000Z');
    expect(toDeckGroupShare({ ...prismaShare, deletedAt }).deletedAt).toEqual(
      deletedAt,
    );
  });
});
