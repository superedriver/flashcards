import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { MyGroupsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { EmptyState } from '@/ui/components'

import { GroupListItem } from './group-list-item'

type GroupListProps = {
  groups: MyGroupsQuery['myGroups']
  onCreateGroup?: () => void
}

export function GroupList({ groups, onCreateGroup }: GroupListProps) {
  const { t } = useTranslation()

  return (
    <View style={{ gap: 8 }}>
      <AppText accessibilityRole="header" style={{ fontSize: 18, fontWeight: '700' }}>
        {t('groups.myGroups.yourGroups')}
      </AppText>
      {groups.length === 0 ? (
        <EmptyState
          actionLabel={onCreateGroup ? t('groups.myGroups.emptyAction') : undefined}
          message={t('groups.myGroups.empty')}
          onAction={onCreateGroup}
        />
      ) : (
        <View
          style={{
            backgroundColor: '#ffffff',
            borderColor: '#e4e7ec',
            borderRadius: 12,
            borderWidth: 1,
            overflow: 'hidden',
          }}
        >
          {groups.map((group, index) => (
            <View key={group.id}>
              {index > 0 ? <View style={{ backgroundColor: '#e4e7ec', height: 1 }} /> : null}
              <GroupListItem group={group} />
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
