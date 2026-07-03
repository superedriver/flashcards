import { useState } from 'react'
import { View } from 'react-native'

import { useLogout } from '@/features/auth/hooks/use-logout'
import { NotificationSettingsCard } from '@/features/notifications/components/notification-settings-card'
import { AccountStatusCard } from '@/features/profile/components/account-status-card'
import { ProfileCard } from '@/features/profile/components/profile-card'
import { UserSettingsForm } from '@/features/settings/components/user-settings-form'
import { useProfileMeQuery } from '@/graphql/generated'
import { AppButton } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function ProfileScreen() {
  const logout = useLogout()
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const { data, error, loading } = useProfileMeQuery()

  const user = data?.me

  return (
    <Screen>
      <PageTitle title="Profile" />

      {loading ? <LoadingState message="Loading profile..." /> : null}
      {error ? <ErrorState message="Could not load profile." /> : null}

      {user ? (
        <View style={{ gap: 12 }}>
          <ProfileCard user={user} />
          <AccountStatusCard user={user} />
          <UserSettingsForm
            notificationsEnabled={notificationsEnabled}
            onNotificationsEnabledChange={setNotificationsEnabled}
          />
          <NotificationSettingsCard
            enabled={notificationsEnabled}
            onEnabledChange={setNotificationsEnabled}
          />
          <AppButton onPress={() => void logout()}>Log Out</AppButton>
        </View>
      ) : null}
    </Screen>
  )
}
