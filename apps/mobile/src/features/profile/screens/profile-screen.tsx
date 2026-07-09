import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const router = useRouter()
  const logout = useLogout()
  const { user: authUser } = useAuth()
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const { data, error, loading, refetch } = useProfileMeQuery()

  const user = data?.me
  const isAdmin = authUser?.role === 'ADMIN'
  const isModerator = authUser?.role === 'MODERATOR'

  return (
    <Screen scrollable>
      <PageTitle title={t('profile.title')} />

      {loading ? <LoadingState message={t('profile.loading')} /> : null}
      {error ? (
        <ErrorState message={t('profile.loadError')} onRetry={() => void refetch()} />
      ) : null}

      {user ? (
        <View style={{ gap: 12 }}>
          <ProfileCard user={user} />
          <AccountStatusCard user={user} />
          <View style={{ gap: 12 }}>
            <AppButton onPress={() => router.push('/groups')}>{t('profile.myGroups')}</AppButton>
            <AppButton onPress={() => router.push('/groups/invitations')}>
              {t('profile.groupInvitations')}
            </AppButton>
          </View>
          {(isAdmin || isModerator) && (
            <View style={{ gap: 12 }}>
              {isAdmin ? (
                <>
                  <AppButton onPress={() => router.push('/admin')}>
                    {t('profile.adminDashboard')}
                  </AppButton>
                  <AppButton onPress={() => router.push('/admin/users')}>
                    {t('profile.userManagement')}
                  </AppButton>
                </>
              ) : null}
              <AppButton onPress={() => router.push('/admin/moderation')}>
                {t('profile.moderationQueue')}
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
          <AppButton onPress={() => void logout()}>{t('profile.logOut')}</AppButton>
        </View>
      ) : null}
    </Screen>
  )
}
