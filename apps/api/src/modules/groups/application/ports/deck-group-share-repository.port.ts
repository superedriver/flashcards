import { DeckGroupShare } from '../../domain/types';
import { Deck } from '../../../decks/domain/types';

export const DECK_GROUP_SHARE_REPOSITORY = Symbol(
  'DECK_GROUP_SHARE_REPOSITORY',
);

export type CreateDeckGroupShareInput = {
  deckId: string;
  groupId: string;
  createdById: string;
};

export type DeckGroupShareRepositoryPort = {
  create(input: CreateDeckGroupShareInput): Promise<DeckGroupShare>;
  findByDeckAndGroup(input: {
    deckId: string;
    groupId: string;
  }): Promise<DeckGroupShare | null>;
  findActiveGroupsForDeck(deckId: string): Promise<DeckGroupShare[]>;
  findSharedDecksForGroup(groupId: string): Promise<Deck[]>;
  userHasAccessToDeck(input: {
    userId: string;
    deckId: string;
  }): Promise<boolean>;
};
