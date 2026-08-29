import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { NotificationSettingsCard } from '@/features/notifications/components/notification-settings-card'
import { ProfileCard } from '@/features/profile/components/profile-card'
import { SettingsNavRow } from '@/features/settings/components/settings-nav-row'
import { UserSettingsForm } from '@/features/settings/components/user-settings-form'
import { useProfileMeQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

const PROFILE_GROUPS_ENABLED = false

export function ProfileScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const logout = useLogout()
  const { user: authUser } = useAuth()
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
        <View style={{ gap: 20 }}>
          <ProfileCard user={user} />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <SettingsNavRow
                disabled={!PROFILE_GROUPS_ENABLED}
                label={t('profile.myGroups')}
                onPress={() => router.push('/groups')}
              />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <SettingsNavRow
                disabled={!PROFILE_GROUPS_ENABLED}
                label={t('profile.groupInvitations')}
                onPress={() => router.push('/groups/invitations')}
              />
            </View>
          </View>

          {(isAdmin || isModerator) && (
            <View style={{ gap: 8 }}>
              {isAdmin ? (
                <>
                  <SettingsNavRow
                    label={t('profile.adminDashboard')}
                    onPress={() => router.push('/admin')}
                  />
                  <SettingsNavRow
                    label={t('profile.userManagement')}
                    onPress={() => router.push('/admin/users')}
                  />
                </>
              ) : null}
              <SettingsNavRow
                label={t('profile.moderationQueue')}
                onPress={() => router.push('/admin/moderation')}
              />
            </View>
          )}

          <UserSettingsForm notificationsSlot={<NotificationSettingsCard />} />

          <View style={{ gap: 8 }}>
            <AppText accessibilityRole="header" style={{ fontSize: 18, fontWeight: '700' }}>
              {t('profile.account')}
            </AppText>
            <Pressable accessibilityRole="button" onPress={() => void logout()}>
              <AppText style={{ color: '#667085', fontSize: 16, fontWeight: '600' }}>
                {t('profile.logOut')}
              </AppText>
            </Pressable>
          </View>
        </View>
      ) : null}
    </Screen>
  )
}
