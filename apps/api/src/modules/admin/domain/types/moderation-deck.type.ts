import { Deck } from '../../../decks/domain/types';

export type ModerationDeck = Deck & {
  ownerEmail: string;
  cardCount: number;
};
