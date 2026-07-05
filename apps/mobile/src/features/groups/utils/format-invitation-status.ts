import { GroupInvitationStatus } from '@/graphql/generated'

export function formatInvitationStatus(status: GroupInvitationStatus): string {
  switch (status) {
    case GroupInvitationStatus.Accepted:
      return 'Accepted'
    case GroupInvitationStatus.Declined:
      return 'Declined'
    case GroupInvitationStatus.Expired:
      return 'Expired'
    case GroupInvitationStatus.Pending:
      return 'Pending'
    default:
      return status
  }
}
