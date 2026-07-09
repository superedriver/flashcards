import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  if (users.length === 0) {
    return <EmptyState message={t('admin.users.empty')} />
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
