import { toDeck } from '../../../decks/infrastructure/mappers/deck.mapper';
import { ModerationDeck } from '../../domain/types';

type PrismaModerationDeckRecord = {
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
  owner: {
    email: string;
  };
  _count: {
    cards: number;
  };
};

export function toModerationDeck(
  record: PrismaModerationDeckRecord,
): ModerationDeck {
  return {
    ...toDeck(record),
    ownerEmail: record.owner.email,
    cardCount: record._count.cards,
  };
}
