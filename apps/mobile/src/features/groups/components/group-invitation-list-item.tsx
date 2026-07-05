import type { MyGroupInvitationsQuery } from '@/graphql/generated'
import { GroupInvitationStatus } from '@/graphql/generated'
import { View } from 'react-native'
import { formatInvitationStatus } from '@/features/groups/utils/format-invitation-status'
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
  const statusLabel = formatInvitationStatus(invitation.status)
  const isExpired = invitation.status === GroupInvitationStatus.Expired

  return (
    <AppCard style={{ gap: 8, marginBottom: 12, padding: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>Group invitation</AppText>
      <AppText style={{ color: '#666666' }}>Invited as {invitation.email}</AppText>
      <AppText style={{ color: isPending ? '#ef6c00' : '#666666', fontWeight: '600' }}>
        Status: {statusLabel}
      </AppText>
      <AppText style={{ color: '#666666' }}>
        {isExpired ? 'Expired' : 'Expires'} {new Date(invitation.expiresAt).toLocaleString()}
      </AppText>

      {isPending && onAccept && onDecline ? (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
          <AppButton disabled={isSubmitting} onPress={() => onAccept(invitation.id)}>
            {isSubmitting ? 'Working...' : 'Accept'}
          </AppButton>
          <AppButton
            background="#b00020"
            color="white"
            disabled={isSubmitting}
            onPress={() => onDecline(invitation.id)}
          >
            Decline
          </AppButton>
        </View>
      ) : null}
    </AppCard>
  )
}
