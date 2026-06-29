import { DeckModerationStatus } from './deck-moderation-status.type';
import { DeckVisibility } from './deck-visibility.type';

export type Deck = {
  id: string;
  ownerId: string;
  title: string;
  description: string | null;
  visibility: DeckVisibility;
  moderationStatus: DeckModerationStatus;
  isOfficial: boolean;
  sourceDeckId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
