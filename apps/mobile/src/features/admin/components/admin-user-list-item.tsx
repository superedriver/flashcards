import { useTranslation } from 'react-i18next'

import type { AdminSearchUsersQuery } from '@/graphql/generated'
import { AppButton, AppCard, AppText } from '@/ui/primitives'
import { destructiveButtonA11yProps } from '@/ui/utils/accessibility'

type AdminUserListItemProps = {
  onBlock?: (userId: string) => void
  onUnblock?: (userId: string) => void
  user: AdminSearchUsersQuery['adminSearchUsers']['items'][number]
  isSubmitting?: boolean
}

function getRoleKey(role: string): 'admin' | 'moderator' | 'user' {
  const normalized = role.toUpperCase()

  if (normalized === 'ADMIN') {
    return 'admin'
  }

  if (normalized === 'MODERATOR') {
    return 'moderator'
  }

  return 'user'
}

export function AdminUserListItem({
  onBlock,
  onUnblock,
  user,
  isSubmitting = false,
}: AdminUserListItemProps) {
  const { t } = useTranslation()
  const isBlocked = Boolean(user.blockedAt)
  const isVerified = Boolean(user.emailVerifiedAt)
  const roleKey = getRoleKey(user.role)

  return (
    <AppCard style={{ gap: 8, marginBottom: 12, padding: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>{user.email}</AppText>
      <AppText style={{ color: '#666666' }}>
        {t('profile.role', { role: t(`profile.roles.${roleKey}`) })}
      </AppText>
      <AppText style={{ color: isVerified ? '#2e7d32' : '#ef6c00', fontWeight: '600' }}>
        {isVerified
          ? t('profile.accountStatus.emailVerified')
          : t('profile.accountStatus.emailNotVerified')}
      </AppText>
      {isBlocked ? (
        <AppText style={{ color: '#b00020', fontWeight: '600' }}>
          {t('admin.users.blocked')}
        </AppText>
      ) : (
        <AppText style={{ color: '#2e7d32' }}>{t('admin.users.active')}</AppText>
      )}

      {isBlocked && onUnblock ? (
        <AppButton disabled={isSubmitting} onPress={() => onUnblock(user.id)}>
          {isSubmitting ? t('admin.users.updating') : t('admin.users.unblockUser')}
        </AppButton>
      ) : null}

      {!isBlocked && onBlock ? (
        <AppButton
          {...destructiveButtonA11yProps(t('admin.users.blockUser'))}
          background="#b00020"
          color="white"
          disabled={isSubmitting}
          onPress={() => onBlock(user.id)}
        >
          {isSubmitting ? t('admin.users.updating') : t('admin.users.blockUser')}
        </AppButton>
      ) : null}
    </AppCard>
  )
}
