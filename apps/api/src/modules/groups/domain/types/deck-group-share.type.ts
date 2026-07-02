import { DeckGroupSharePermission } from './deck-group-share-permission.type';

export type DeckGroupShare = {
  id: string;
  deckId: string;
  groupId: string;
  permission: DeckGroupSharePermission;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
