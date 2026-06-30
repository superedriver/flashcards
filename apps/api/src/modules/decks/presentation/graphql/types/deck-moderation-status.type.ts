import { registerEnumType } from '@nestjs/graphql';

export enum DeckModerationStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  HIDDEN = 'HIDDEN',
}

registerEnumType(DeckModerationStatus, {
  name: 'DeckModerationStatus',
});
