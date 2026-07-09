import { useTranslation } from 'react-i18next'

import type { MyGroupsQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'

import { GroupListItem } from './group-list-item'

type GroupListProps = {
  groups: MyGroupsQuery['myGroups']
  onCreateGroup?: () => void
}

export function GroupList({ groups, onCreateGroup }: GroupListProps) {
  const { t } = useTranslation()

  if (groups.length === 0) {
    return (
      <EmptyState
        actionLabel={onCreateGroup ? t('groups.myGroups.emptyAction') : undefined}
        message={t('groups.myGroups.empty')}
        onAction={onCreateGroup}
      />
    )
  }

  return (
    <>
      {groups.map((group) => (
        <GroupListItem key={group.id} group={group} />
      ))}
    </>
  )
}
