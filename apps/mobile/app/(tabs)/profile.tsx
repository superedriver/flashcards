import { useAuth } from '@/features/auth/hooks/use-auth'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { AppButton, AppText } from '@/ui/primitives'
import { PageTitle, Screen } from '@/ui/components'

export default function ProfileScreen() {
  const { user } = useAuth()
  const logout = useLogout()

  return (
    <Screen>
      <PageTitle title="Profile" />
      {user ? <AppText>{user.email}</AppText> : null}
      <AppButton onPress={() => void logout()}>Log Out</AppButton>
    </Screen>
  )
}
