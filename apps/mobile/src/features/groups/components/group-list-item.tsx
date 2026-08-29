import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { GroupMemberAvatars } from '@/features/groups/components/group-member-avatars'
import { GroupOwnerMenu } from '@/features/groups/components/group-owner-menu'
import { GroupRoleBadge } from '@/features/groups/components/group-role-badge'
import { GroupRowIcon } from '@/features/groups/components/group-row-icon'
import { GroupRole, type MyGroupsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { buttonA11yProps } from '@/ui/utils/accessibility'

type GroupListItemProps = {
  group: MyGroupsQuery['myGroups'][number]
}

export function GroupListItem({ group }: GroupListItemProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const memberCount = group.memberCount ?? group.membersPreview.length
  const extraCount = Math.max(0, memberCount - group.membersPreview.length)
  const isOwner = group.myRole === GroupRole.Owner

  return (
    <Pressable
      {...buttonA11yProps(group.name)}
      onPress={() => router.push(`/groups/${group.id}`)}
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        minHeight: 88,
        paddingHorizontal: 12,
        paddingVertical: 12,
      }}
    >
      <GroupRowIcon name={group.name} />
      <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
        <AppText numberOfLines={1} style={{ fontSize: 15, fontWeight: '700' }}>
          {group.name}
        </AppText>
        {group.description ? (
          <AppText numberOfLines={1} style={{ color: '#667085', fontSize: 12 }}>
            {group.description}
          </AppText>
        ) : null}
        <AppText style={{ color: '#98a2b3', fontSize: 12 }}>
          {t('groups.myGroups.memberCount', { count: memberCount })}
        </AppText>
      </View>
      <GroupRoleBadge role={group.myRole} />
      <View style={{ flexShrink: 0 }}>
        <GroupMemberAvatars extraCount={extraCount} members={group.membersPreview} />
      </View>
      <Ionicons color="#98a2b3" name="chevron-forward" size={16} />
      {isOwner ? <GroupOwnerMenu groupId={group.id} /> : null}
    </Pressable>
  )
}
