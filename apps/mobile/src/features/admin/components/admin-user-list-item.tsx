import type { AdminSearchUsersQuery } from '@/graphql/generated'
import { AppButton, AppCard, AppText } from '@/ui/primitives'

type AdminUserListItemProps = {
  onBlock?: (userId: string) => void
  onUnblock?: (userId: string) => void
  user: AdminSearchUsersQuery['adminSearchUsers']['items'][number]
  isSubmitting?: boolean
}

export function AdminUserListItem({
  onBlock,
  onUnblock,
  user,
  isSubmitting = false,
}: AdminUserListItemProps) {
  const isBlocked = Boolean(user.blockedAt)
  const isVerified = Boolean(user.emailVerifiedAt)

  return (
    <AppCard style={{ gap: 8, marginBottom: 12, padding: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>{user.email}</AppText>
      <AppText>Role: {user.role}</AppText>
      <AppText style={{ color: isVerified ? '#2e7d32' : '#ed6c02' }}>
        {isVerified ? 'Email verified' : 'Email not verified'}
      </AppText>
      {isBlocked ? <AppText style={{ color: '#b00020' }}>Blocked</AppText> : null}

      {isBlocked && onUnblock ? (
        <AppButton disabled={isSubmitting} onPress={() => onUnblock(user.id)}>
          Unblock User
        </AppButton>
      ) : null}

      {!isBlocked && onBlock ? (
        <AppButton disabled={isSubmitting} onPress={() => onBlock(user.id)}>
          Block User
        </AppButton>
      ) : null}
    </AppCard>
  )
}
