import { DeckGroupShare, DeckGroupSharePermission } from '../../domain/types';

type PrismaDeckGroupShareRecord = {
  id: string;
  deckId: string;
  groupId: string;
  permission: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export function toDeckGroupShare(
  share: PrismaDeckGroupShareRecord,
): DeckGroupShare {
  return {
    id: share.id,
    deckId: share.deckId,
    groupId: share.groupId,
    permission: share.permission as DeckGroupSharePermission,
    createdById: share.createdById,
    createdAt: share.createdAt,
    updatedAt: share.updatedAt,
    deletedAt: share.deletedAt,
  };
}
