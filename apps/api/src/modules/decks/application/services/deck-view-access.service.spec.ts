import { AuthUser } from '../../../auth/domain/types';
import { DeckPermissionService } from '../../domain/services/deck-permission.service';
import { Deck } from '../../domain/types';
import { canViewDeck } from './deck-view-access.service';

const owner: AuthUser = {
  id: 'owner-1',
  email: 'owner@example.com',
  role: 'USER',
};

const member: AuthUser = {
  id: 'member-1',
  email: 'member@example.com',
  role: 'USER',
};

const deck: Deck = {
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
};

function createDeckGroupShareRepository(userHasAccess = false) {
  return {
    create: jest.fn(),
    findByDeckAndGroup: jest.fn(),
    findActiveGroupsForDeck: jest.fn(),
    findSharedDecksForGroup: jest.fn(),
    userHasAccessToDeck: jest.fn().mockResolvedValue(userHasAccess),
  };
}

describe('canViewDeck', () => {
  const deckPermissionService = new DeckPermissionService();

  it('returns true when DeckPermissionService.canViewDeck is true', async () => {
    const deckGroupShareRepository = createDeckGroupShareRepository(false);

    await expect(
      canViewDeck({
        user: owner,
        deck,
        deckPermissionService,
        deckGroupShareRepository,
      }),
    ).resolves.toBe(true);

    expect(deckGroupShareRepository.userHasAccessToDeck).not.toHaveBeenCalled();
  });

  it('returns false for anonymous user when permission check fails', async () => {
    const deckGroupShareRepository = createDeckGroupShareRepository(true);

    await expect(
      canViewDeck({
        user: null,
        deck,
        deckPermissionService,
        deckGroupShareRepository,
      }),
    ).resolves.toBe(false);

    expect(deckGroupShareRepository.userHasAccessToDeck).not.toHaveBeenCalled();
  });

  it('returns true for authenticated user when userHasAccessToDeck is true', async () => {
    const deckGroupShareRepository = createDeckGroupShareRepository(true);

    await expect(
      canViewDeck({
        user: member,
        deck,
        deckPermissionService,
        deckGroupShareRepository,
      }),
    ).resolves.toBe(true);

    expect(deckGroupShareRepository.userHasAccessToDeck).toHaveBeenCalledWith({
      userId: 'member-1',
      deckId: 'deck-1',
    });
  });

  it('returns false for authenticated user when neither permission nor group share grants access', async () => {
    const deckGroupShareRepository = createDeckGroupShareRepository(false);

    await expect(
      canViewDeck({
        user: member,
        deck,
        deckPermissionService,
        deckGroupShareRepository,
      }),
    ).resolves.toBe(false);
  });
});
