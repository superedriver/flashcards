import type { MyGroupsQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'

import { GroupListItem } from './group-list-item'

type GroupListProps = {
  groups: MyGroupsQuery['myGroups']
  onCreateGroup?: () => void
}

export function GroupList({ groups, onCreateGroup }: GroupListProps) {
  if (groups.length === 0) {
    return (
      <EmptyState
        actionLabel={onCreateGroup ? 'Create a group' : undefined}
        message="You are not in any groups yet."
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
