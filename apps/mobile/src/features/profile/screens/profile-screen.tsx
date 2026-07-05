import { useRouter } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { NotificationSettingsCard } from '@/features/notifications/components/notification-settings-card'
import { AccountStatusCard } from '@/features/profile/components/account-status-card'
import { ProfileCard } from '@/features/profile/components/profile-card'
import { UserSettingsForm } from '@/features/settings/components/user-settings-form'
import { useProfileMeQuery } from '@/graphql/generated'
import { AppButton } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function ProfileScreen() {
  const router = useRouter()
  const logout = useLogout()
  const { user: authUser } = useAuth()
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const { data, error, loading, refetch } = useProfileMeQuery()

  const user = data?.me
  const isAdmin = authUser?.role === 'ADMIN'
  const isModerator = authUser?.role === 'MODERATOR'

  return (
    <Screen>
      <PageTitle title="Profile" />

      {loading ? <LoadingState message="Loading profile..." /> : null}
      {error ? (
        <ErrorState message="Could not load profile." onRetry={() => void refetch()} />
      ) : null}

      {user ? (
        <View style={{ gap: 12 }}>
          <ProfileCard user={user} />
          <AccountStatusCard user={user} />
          <View style={{ gap: 12 }}>
            <AppButton onPress={() => router.push('/groups')}>My Groups</AppButton>
            <AppButton onPress={() => router.push('/groups/invitations')}>
              Group Invitations
            </AppButton>
          </View>
          {(isAdmin || isModerator) && (
            <View style={{ gap: 12 }}>
              {isAdmin ? (
                <>
                  <AppButton onPress={() => router.push('/admin')}>Admin Dashboard</AppButton>
                  <AppButton onPress={() => router.push('/admin/users')}>User Management</AppButton>
                </>
              ) : null}
              <AppButton onPress={() => router.push('/admin/moderation')}>
                Moderation Queue
              </AppButton>
            </View>
          )}
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
