import type { ProfileMeQuery } from '@/graphql/generated'
import { AppCard, AppText } from '@/ui/primitives'

type ProfileCardProps = {
  user: NonNullable<ProfileMeQuery['me']>
}

function formatRole(role: string): string {
  return role.charAt(0) + role.slice(1).toLowerCase()
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <AppCard style={{ gap: 8, marginBottom: 16, padding: 16 }}>
      <AppText style={{ color: '#666666', fontSize: 12, textTransform: 'uppercase' }}>
        Signed in as
      </AppText>
      <AppText style={{ fontSize: 18, fontWeight: '600' }}>{user.email}</AppText>
      <AppText style={{ color: '#666666' }}>Role: {formatRole(user.role)}</AppText>
      <AppText style={{ color: '#666666' }}>
        Joined {new Date(user.createdAt).toLocaleDateString()}
      </AppText>
    </AppCard>
  )
}
