import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

import type { ProfileMeQuery } from '@/graphql/generated'
import { formatDateTime } from '@/i18n/formatters'
import { AppButton, AppCard, AppText } from '@/ui/primitives'

type AccountStatusCardProps = {
  user: NonNullable<ProfileMeQuery['me']>
}

export function AccountStatusCard({ user }: AccountStatusCardProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const isVerified = Boolean(user.emailVerifiedAt)
  const isBlocked = Boolean(user.blockedAt)

  return (
    <AppCard style={{ gap: 8, marginBottom: 16, padding: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>
        {t('profile.accountStatus.title')}
      </AppText>
      <AppText style={{ color: isVerified ? '#2e7d32' : '#ef6c00', fontWeight: '600' }}>
        {isVerified
          ? t('profile.accountStatus.emailVerified')
          : t('profile.accountStatus.emailNotVerified')}
      </AppText>
      {isVerified && user.emailVerifiedAt ? (
        <AppText style={{ color: '#666666' }}>
          {t('profile.accountStatus.verifiedAt', {
            date: formatDateTime(user.emailVerifiedAt),
          })}
        </AppText>
      ) : (
        <AppText style={{ color: '#666666' }}>{t('profile.accountStatus.verifyPrompt')}</AppText>
      )}
      {!isVerified ? (
        <AppButton onPress={() => router.push('/(auth)/verify-email-prompt')}>
          {t('profile.accountStatus.resendVerification')}
        </AppButton>
      ) : null}
      {isBlocked ? (
        <AppText style={{ color: '#b00020', fontWeight: '600' }}>
          {t('profile.accountStatus.blocked')}
        </AppText>
      ) : null}
    </AppCard>
  )
}
