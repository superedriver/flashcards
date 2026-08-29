import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { GroupRole } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'

type GroupRoleBadgeProps = {
  role?: GroupRole | null
}

export function GroupRoleBadge({ role }: GroupRoleBadgeProps) {
  const { t } = useTranslation()
  const isOwner = role === GroupRole.Owner

  return (
    <View
      style={{
        backgroundColor: isOwner ? '#dcfce7' : '#e8f0fe',
        borderRadius: 999,
        flexShrink: 0,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
    >
      <AppText
        style={{
          color: isOwner ? '#166534' : '#1a56db',
          fontSize: 12,
          fontWeight: '700',
        }}
      >
        {isOwner
          ? t('groups.roles.owner')
          : role === GroupRole.Admin
            ? t('groups.roles.admin')
            : t('groups.roles.member')}
      </AppText>
    </View>
  )
}
