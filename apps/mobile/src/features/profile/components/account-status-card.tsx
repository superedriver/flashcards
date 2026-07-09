import { useRouter } from 'expo-router'

import type { ProfileMeQuery } from '@/graphql/generated'
import { formatDateTime } from '@/i18n/formatters'
import { AppButton, AppCard, AppText } from '@/ui/primitives'

type AccountStatusCardProps = {
  user: NonNullable<ProfileMeQuery['me']>
}

export function AccountStatusCard({ user }: AccountStatusCardProps) {
  const router = useRouter()
  const isVerified = Boolean(user.emailVerifiedAt)
  const isBlocked = Boolean(user.blockedAt)

  return (
    <AppCard style={{ gap: 8, marginBottom: 16, padding: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>Account status</AppText>
      <AppText style={{ color: isVerified ? '#2e7d32' : '#ef6c00', fontWeight: '600' }}>
        {isVerified ? 'Email verified' : 'Email not verified'}
      </AppText>
      {isVerified && user.emailVerifiedAt ? (
        <AppText style={{ color: '#666666' }}>
          Verified {formatDateTime(user.emailVerifiedAt)}
        </AppText>
      ) : (
        <AppText style={{ color: '#666666' }}>
          Verify your email to secure your account and unlock all features.
        </AppText>
      )}
      {!isVerified ? (
        <AppButton onPress={() => router.push('/(auth)/verify-email-prompt')}>
          Resend verification email
        </AppButton>
      ) : null}
      {isBlocked ? (
        <AppText style={{ color: '#b00020', fontWeight: '600' }}>
          This account is blocked. Contact support if you think this is a mistake.
        </AppText>
      ) : null}
    </AppCard>
  )
}
