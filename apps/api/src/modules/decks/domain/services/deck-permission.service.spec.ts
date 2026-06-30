import { AuthUser } from '../../../auth/domain/types';
import { Deck } from '../types';
import { DeckPermissionService } from './deck-permission.service';

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

describe('DeckPermissionService', () => {
  const service = new DeckPermissionService();

  it('owner can view own private deck', () => {
    expect(service.canViewDeck({ user: owner, deck: createDeck() })).toBe(true);
  });

  it('owner can manage own active deck', () => {
    expect(service.canManageDeck({ user: owner, deck: createDeck() })).toBe(
      true,
    );
  });

  it('anonymous user cannot view private deck', () => {
    expect(service.canViewDeck({ user: null, deck: createDeck() })).toBe(false);
  });

  it('anonymous user cannot manage private deck', () => {
    expect(service.canManageDeck({ user: null, deck: createDeck() })).toBe(
      false,
    );
  });

  it('non-owner cannot view private deck', () => {
    expect(service.canViewDeck({ user: otherUser, deck: createDeck() })).toBe(
      false,
    );
  });

  it('non-owner cannot manage private deck', () => {
    expect(service.canManageDeck({ user: otherUser, deck: createDeck() })).toBe(
      false,
    );
  });

  it('anonymous user can view public approved deck', () => {
    expect(
      service.canViewDeck({
        user: null,
        deck: createDeck({
          visibility: 'PUBLIC',
          moderationStatus: 'APPROVED',
        }),
      }),
    ).toBe(true);
  });

  it('authenticated non-owner can view public approved deck', () => {
    expect(
      service.canViewDeck({
        user: otherUser,
        deck: createDeck({
          visibility: 'PUBLIC',
          moderationStatus: 'APPROVED',
        }),
      }),
    ).toBe(true);
  });

  it('user cannot view deleted deck', () => {
    expect(
      service.canViewDeck({
        user: owner,
        deck: createDeck({ deletedAt: new Date('2026-06-01T00:00:00.000Z') }),
      }),
    ).toBe(false);
  });

  it('owner cannot manage deleted deck', () => {
    expect(
      service.canManageDeck({
        user: owner,
        deck: createDeck({ deletedAt: new Date('2026-06-01T00:00:00.000Z') }),
      }),
    ).toBe(false);
  });

  it('user cannot view public deck with moderationStatus != APPROVED', () => {
    expect(
      service.canViewDeck({
        user: null,
        deck: createDeck({
          visibility: 'PUBLIC',
          moderationStatus: 'PENDING',
        }),
      }),
    ).toBe(false);
  });

  it('canCreateCard follows canManageDeck', () => {
    const deck = createDeck();
    expect(service.canCreateCard({ user: owner, deck })).toBe(true);
    expect(service.canCreateCard({ user: otherUser, deck })).toBe(false);
  });

  it('canManageCard follows canManageDeck', () => {
    const deck = createDeck();
    expect(service.canManageCard({ user: owner, deck })).toBe(true);
    expect(service.canManageCard({ user: otherUser, deck })).toBe(false);
  });
});
