import { AuthUser } from '../../../auth/domain/types';
import { DeckGroupShareRepositoryPort } from '../../../groups/application/ports/deck-group-share-repository.port';
import { DeckPermissionService } from '../../domain/services/deck-permission.service';
import { Deck } from '../../domain/types';

export async function canViewDeck(input: {
  user: AuthUser | null;
  deck: Deck;
  deckPermissionService: DeckPermissionService;
  deckGroupShareRepository: DeckGroupShareRepositoryPort;
}): Promise<boolean> {
  const canViewByPermission = input.deckPermissionService.canViewDeck({
    user: input.user,
    deck: input.deck,
  });

  if (canViewByPermission) {
    return true;
  }

  if (input.user === null) {
    return false;
  }

  return input.deckGroupShareRepository.userHasAccessToDeck({
    userId: input.user.id,
    deckId: input.deck.id,
  });
}
