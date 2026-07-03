import type { ProfileMeQuery } from '@/graphql/generated'
import { AppCard, AppText } from '@/ui/primitives'

type AccountStatusCardProps = {
  user: NonNullable<ProfileMeQuery['me']>
}

export function AccountStatusCard({ user }: AccountStatusCardProps) {
  const isVerified = Boolean(user.emailVerifiedAt)
  const isBlocked = Boolean(user.blockedAt)

  return (
    <AppCard style={{ gap: 8, marginBottom: 16, padding: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>Account status</AppText>
      <AppText style={{ color: isVerified ? '#2e7d32' : '#ed6c02' }}>
        {isVerified ? 'Email verified' : 'Email not verified'}
      </AppText>
      {isBlocked ? <AppText style={{ color: '#b00020' }}>Account blocked</AppText> : null}
    </AppCard>
  )
}
