import type { AdminSearchUsersQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'

import { AdminUserListItem } from './admin-user-list-item'

type AdminUserListProps = {
  isSubmitting?: boolean
  onBlock?: (userId: string) => void
  onUnblock?: (userId: string) => void
  users: AdminSearchUsersQuery['adminSearchUsers']['items']
}

export function AdminUserList({
  isSubmitting = false,
  onBlock,
  onUnblock,
  users,
}: AdminUserListProps) {
  if (users.length === 0) {
    return <EmptyState message="No users found." />
  }

  return (
    <>
      {users.map((user) => (
        <AdminUserListItem
          key={user.id}
          isSubmitting={isSubmitting}
          user={user}
          onBlock={onBlock}
          onUnblock={onUnblock}
        />
      ))}
    </>
  )
}
