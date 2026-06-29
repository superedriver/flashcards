import { AuthUser } from '../../../auth/domain/types';
import { Deck } from '../types';

function isActiveDeck(deck: Deck): boolean {
  return deck.deletedAt === null;
}

function isDeckOwner(user: AuthUser | null, deck: Deck): boolean {
  return user !== null && user.id === deck.ownerId;
}

function isPublicApprovedDeck(deck: Deck): boolean {
  return (
    deck.visibility === 'PUBLIC' &&
    deck.moderationStatus === 'APPROVED' &&
    isActiveDeck(deck)
  );
}

export class DeckPermissionService {
  canViewDeck(input: { user: AuthUser | null; deck: Deck }): boolean {
    const { user, deck } = input;

    if (!isActiveDeck(deck)) {
      return false;
    }

    if (isDeckOwner(user, deck)) {
      return true;
    }

    return isPublicApprovedDeck(deck);
  }

  canManageDeck(input: { user: AuthUser | null; deck: Deck }): boolean {
    const { user, deck } = input;

    if (user === null || !isActiveDeck(deck)) {
      return false;
    }

    return isDeckOwner(user, deck);
  }

  canCreateCard(input: { user: AuthUser | null; deck: Deck }): boolean {
    return this.canManageDeck(input);
  }

  canManageCard(input: { user: AuthUser | null; deck: Deck }): boolean {
    return this.canManageDeck(input);
  }
}
