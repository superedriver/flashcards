import type { MyGroupInvitationsQuery } from '@/graphql/generated'
import { GroupInvitationStatus } from '@/graphql/generated'
import { AppButton, AppCard, AppText } from '@/ui/primitives'

type GroupInvitationListItemProps = {
  invitation: MyGroupInvitationsQuery['myGroupInvitations'][number]
  isSubmitting?: boolean
  onAccept?: (invitationId: string) => void
  onDecline?: (invitationId: string) => void
}

export function GroupInvitationListItem({
  invitation,
  isSubmitting = false,
  onAccept,
  onDecline,
}: GroupInvitationListItemProps) {
  const isPending = invitation.status === GroupInvitationStatus.Pending

  return (
    <AppCard style={{ gap: 8, marginBottom: 12, padding: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>Group {invitation.groupId}</AppText>
      <AppText>{invitation.email}</AppText>
      <AppText style={{ color: '#666666' }}>Status: {invitation.status}</AppText>
      <AppText style={{ color: '#666666' }}>
        Expires {new Date(invitation.expiresAt).toLocaleDateString()}
      </AppText>

      {isPending && onAccept && onDecline ? (
        <>
          <AppButton disabled={isSubmitting} onPress={() => onAccept(invitation.id)}>
            Accept
          </AppButton>
          <AppButton disabled={isSubmitting} onPress={() => onDecline(invitation.id)}>
            Decline
          </AppButton>
        </>
      ) : null}
    </AppCard>
  )
}
