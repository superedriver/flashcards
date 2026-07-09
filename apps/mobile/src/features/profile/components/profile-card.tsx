import { useTranslation } from 'react-i18next'

import type { ProfileMeQuery } from '@/graphql/generated'
import { formatDate } from '@/i18n/formatters'
import { AppCard, AppText } from '@/ui/primitives'

type ProfileCardProps = {
  user: NonNullable<ProfileMeQuery['me']>
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

export function ProfileCard({ user }: ProfileCardProps) {
  const { t } = useTranslation()
  const roleKey = getRoleKey(user.role)

  return (
    <AppCard style={{ gap: 8, marginBottom: 16, padding: 16 }}>
      <AppText style={{ color: '#666666', fontSize: 12, textTransform: 'uppercase' }}>
        {t('profile.signedInAs')}
      </AppText>
      <AppText style={{ fontSize: 18, fontWeight: '600' }}>{user.email}</AppText>
      <AppText style={{ color: '#666666' }}>
        {t('profile.role', { role: t(`profile.roles.${roleKey}`) })}
      </AppText>
      <AppText style={{ color: '#666666' }}>
        {t('profile.joined', { date: formatDate(user.createdAt) })}
      </AppText>
    </AppCard>
  )
}
