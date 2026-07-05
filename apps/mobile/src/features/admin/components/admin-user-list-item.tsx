import type { AdminSearchUsersQuery } from '@/graphql/generated'
import { AppButton, AppCard, AppText } from '@/ui/primitives'
import { destructiveButtonA11yProps } from '@/ui/utils/accessibility'

type AdminUserListItemProps = {
  onBlock?: (userId: string) => void
  onUnblock?: (userId: string) => void
  user: AdminSearchUsersQuery['adminSearchUsers']['items'][number]
  isSubmitting?: boolean
}

function formatRole(role: string): string {
  return role.charAt(0) + role.slice(1).toLowerCase()
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
      <AppText style={{ color: '#666666' }}>Role: {formatRole(user.role)}</AppText>
      <AppText style={{ color: isVerified ? '#2e7d32' : '#ef6c00', fontWeight: '600' }}>
        {isVerified ? 'Email verified' : 'Email not verified'}
      </AppText>
      {isBlocked ? (
        <AppText style={{ color: '#b00020', fontWeight: '600' }}>Blocked</AppText>
      ) : (
        <AppText style={{ color: '#2e7d32' }}>Active</AppText>
      )}

      {isBlocked && onUnblock ? (
        <AppButton disabled={isSubmitting} onPress={() => onUnblock(user.id)}>
          {isSubmitting ? 'Updating...' : 'Unblock user'}
        </AppButton>
      ) : null}

      {!isBlocked && onBlock ? (
        <AppButton
          {...destructiveButtonA11yProps('Block user')}
          background="#b00020"
          color="white"
          disabled={isSubmitting}
          onPress={() => onBlock(user.id)}
        >
          {isSubmitting ? 'Updating...' : 'Block user'}
        </AppButton>
      ) : null}
    </AppCard>
  )
}
