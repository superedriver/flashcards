import type { TFunction } from 'i18next'

import { GroupInvitationStatus } from '@/graphql/generated'

export function formatInvitationStatus(t: TFunction, status: GroupInvitationStatus): string {
  switch (status) {
    case GroupInvitationStatus.Accepted:
      return t('groups.invitationStatus.accepted')
    case GroupInvitationStatus.Declined:
      return t('groups.invitationStatus.declined')
    case GroupInvitationStatus.Expired:
      return t('groups.invitationStatus.expired')
    case GroupInvitationStatus.Pending:
      return t('groups.invitationStatus.pending')
    default:
      return status
  }
}
