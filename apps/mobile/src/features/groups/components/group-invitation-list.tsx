import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import type { MyGroupInvitationsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { buttonA11yProps } from '@/ui/utils/accessibility'

import { GroupInvitationListItem } from './group-invitation-list-item'

type GroupInvitationListProps = {
  invitations: MyGroupInvitationsQuery['myGroupInvitations']
  isSubmittingId?: string | null
  onAccept?: (invitationId: string) => void
  onBackToGroups?: () => void
  onDecline?: (invitationId: string) => void
}

export function GroupInvitationList({
  invitations,
  isSubmittingId = null,
  onAccept,
  onBackToGroups,
  onDecline,
}: GroupInvitationListProps) {
  const { t } = useTranslation()

  if (invitations.length === 0) {
    return (
      <View style={{ alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingVertical: 40 }}>
        <AppText style={{ fontSize: 36 }}>✉️</AppText>
        <AppText style={{ fontSize: 18, fontWeight: '700', textAlign: 'center' }}>
          {t('groups.invitations.emptyTitle')}
        </AppText>
        <AppText style={{ color: '#667085', fontSize: 14, textAlign: 'center' }}>
          {t('groups.invitations.emptyBody')}
        </AppText>
        {onBackToGroups ? (
          <Pressable
            {...buttonA11yProps(t('groups.invitations.backToGroups'))}
            onPress={onBackToGroups}
            style={{
              alignItems: 'center',
              borderColor: '#e4e7ec',
              borderRadius: 8,
              borderWidth: 1,
              flexDirection: 'row',
              gap: 6,
              marginTop: 8,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            <Ionicons color="#344054" name="chevron-back" size={16} />
            <AppText style={{ fontSize: 14, fontWeight: '600' }}>
              {t('groups.invitations.backToGroups')}
            </AppText>
          </Pressable>
        ) : null}
      </View>
    )
  }

  return (
    <View style={{ gap: 12 }}>
      {invitations.map((invitation) => (
        <GroupInvitationListItem
          key={invitation.id}
          invitation={invitation}
          isSubmitting={isSubmittingId === invitation.id}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      ))}
    </View>
  )
}
