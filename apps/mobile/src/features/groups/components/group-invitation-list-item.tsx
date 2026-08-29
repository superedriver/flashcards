import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import type { MyGroupInvitationsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { buttonA11yProps } from '@/ui/utils/accessibility'

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
  const groupName = invitation.groupName?.trim() || t('groups.invitations.unknownGroup')
  const invitedBy = invitation.invitedByEmail?.trim()
  const memberCount = invitation.memberCount
  const sharedDeckCount = invitation.sharedDeckCount

  const stats = [
    memberCount != null ? t('groups.invitations.memberCount', { count: memberCount }) : null,
    sharedDeckCount != null
      ? t('groups.invitations.sharedDeckCount', { count: sharedDeckCount })
      : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <View
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#e4e7ec',
        borderRadius: 12,
        borderWidth: 1,
        gap: 10,
        padding: 14,
      }}
    >
      <View style={{ alignItems: 'flex-start', flexDirection: 'row', gap: 10 }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#e8f0fe',
            borderRadius: 10,
            height: 40,
            justifyContent: 'center',
            width: 40,
          }}
        >
          <Ionicons color="#1a56db" name="people-outline" size={20} />
        </View>
        <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
          <AppText numberOfLines={1} style={{ fontSize: 16, fontWeight: '700' }}>
            {groupName}
          </AppText>
          {invitedBy ? (
            <AppText numberOfLines={1} style={{ color: '#667085', fontSize: 13 }}>
              {t('groups.invitations.invitedBy', { email: invitedBy })}
            </AppText>
          ) : null}
          {stats ? <AppText style={{ color: '#98a2b3', fontSize: 13 }}>{stats}</AppText> : null}
        </View>
      </View>

      {onAccept && onDecline ? (
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 12,
            justifyContent: 'space-between',
            marginTop: 4,
          }}
        >
          <Pressable
            {...buttonA11yProps(t('groups.invitations.declineA11y'))}
            disabled={isSubmitting}
            onPress={() => onDecline(invitation.id)}
            style={{ opacity: isSubmitting ? 0.5 : 1, paddingHorizontal: 8, paddingVertical: 8 }}
          >
            <AppText style={{ color: '#667085', fontSize: 15, fontWeight: '600' }}>
              {t('groups.invitations.decline')}
            </AppText>
          </Pressable>
          <Pressable
            {...buttonA11yProps(t('groups.invitations.accept'))}
            disabled={isSubmitting}
            onPress={() => onAccept(invitation.id)}
            style={{
              backgroundColor: '#1a56db',
              borderRadius: 8,
              opacity: isSubmitting ? 0.5 : 1,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <AppText style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
              {isSubmitting ? t('groups.invitations.working') : t('groups.invitations.accept')}
            </AppText>
          </Pressable>
        </View>
      ) : null}
    </View>
  )
}
