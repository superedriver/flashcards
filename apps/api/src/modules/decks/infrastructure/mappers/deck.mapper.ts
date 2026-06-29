import { Deck, DeckModerationStatus, DeckVisibility } from '../../domain/types';

type PrismaDeckRecord = {
  id: string;
  ownerId: string;
  title: string;
  description: string | null;
  visibility: string;
  moderationStatus: string;
  isOfficial: boolean;
  sourceDeckId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export function toDeck(deck: PrismaDeckRecord): Deck {
  return {
    id: deck.id,
    ownerId: deck.ownerId,
    title: deck.title,
    description: deck.description,
    visibility: deck.visibility as DeckVisibility,
    moderationStatus: deck.moderationStatus as DeckModerationStatus,
    isOfficial: deck.isOfficial,
    sourceDeckId: deck.sourceDeckId,
    createdAt: deck.createdAt,
    updatedAt: deck.updatedAt,
    deletedAt: deck.deletedAt,
  };
}
