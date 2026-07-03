import type { MyGroupsQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'

import { GroupListItem } from './group-list-item'

type GroupListProps = {
  groups: MyGroupsQuery['myGroups']
}

export function GroupList({ groups }: GroupListProps) {
  if (groups.length === 0) {
    return <EmptyState message="You are not in any groups yet." />
  }

  return (
    <>
      {groups.map((group) => (
        <GroupListItem key={group.id} group={group} />
      ))}
    </>
  )
}
