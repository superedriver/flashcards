import { registerEnumType } from '@nestjs/graphql';

export enum GroupInvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

registerEnumType(GroupInvitationStatus, {
  name: 'GroupInvitationStatus',
});
