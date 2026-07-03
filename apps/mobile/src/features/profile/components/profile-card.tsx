import type { ProfileMeQuery } from '@/graphql/generated'
import { AppCard, AppText } from '@/ui/primitives'

type ProfileCardProps = {
  user: NonNullable<ProfileMeQuery['me']>
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <AppCard style={{ gap: 8, marginBottom: 16, padding: 16 }}>
      <AppText style={{ fontSize: 18, fontWeight: '600' }}>{user.email}</AppText>
      <AppText>Role: {user.role}</AppText>
      <AppText style={{ color: '#666666' }}>
        Joined {new Date(user.createdAt).toLocaleDateString()}
      </AppText>
    </AppCard>
  )
}
