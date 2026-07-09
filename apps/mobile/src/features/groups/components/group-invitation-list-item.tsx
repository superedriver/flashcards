import type { MyGroupInvitationsQuery } from '@/graphql/generated'
import { GroupInvitationStatus } from '@/graphql/generated'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { formatInvitationStatus } from '@/features/groups/utils/format-invitation-status'
import { formatDateTime } from '@/i18n/formatters'
import { AppButton, AppCard, AppText } from '@/ui/primitives'
import { destructiveButtonA11yProps } from '@/ui/utils/accessibility'

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
  const { t } = useTranslation()
  const isPending = invitation.status === GroupInvitationStatus.Pending
  const statusLabel = formatInvitationStatus(t, invitation.status)
  const isExpired = invitation.status === GroupInvitationStatus.Expired

  return (
    <AppCard style={{ gap: 8, marginBottom: 12, padding: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>
        {t('groups.invitations.invitationTitle')}
      </AppText>
      <AppText style={{ color: '#666666' }}>
        {t('groups.invitations.invitedAs', { email: invitation.email })}
      </AppText>
      <AppText style={{ color: isPending ? '#ef6c00' : '#666666', fontWeight: '600' }}>
        {t('groups.invitations.status', { status: statusLabel })}
      </AppText>
      <AppText style={{ color: '#666666' }}>
        {isExpired ? t('groups.invitations.expired') : t('groups.invitations.expires')}{' '}
        {formatDateTime(invitation.expiresAt)}
      </AppText>

      {isPending && onAccept && onDecline ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          <AppButton disabled={isSubmitting} onPress={() => onAccept(invitation.id)}>
            {isSubmitting ? t('groups.invitations.working') : t('groups.invitations.accept')}
          </AppButton>
          <AppButton
            {...destructiveButtonA11yProps(t('groups.invitations.declineA11y'))}
            background="#b00020"
            color="white"
            disabled={isSubmitting}
            onPress={() => onDecline(invitation.id)}
          >
            {t('groups.invitations.decline')}
          </AppButton>
        </View>
      ) : null}
    </AppCard>
  )
}
