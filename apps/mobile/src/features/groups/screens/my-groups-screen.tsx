import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { GroupList } from '@/features/groups/components/group-list'
import { useMyGroupsQuery } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function MyGroupsScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { data, error, loading, refetch } = useMyGroupsQuery()

  return (
    <Screen scrollable>
      <PageTitle title={t('groups.myGroups.title')} />
      <AppText style={{ color: '#666666', marginBottom: 12 }}>
        {t('groups.myGroups.subtitle')}
      </AppText>
      <View style={{ gap: 12, marginBottom: 16 }}>
        <AppButton onPress={() => router.push('/groups/new')}>
          {t('groups.myGroups.createGroup')}
        </AppButton>
        <AppButton onPress={() => router.push('/groups/invitations')}>
          {t('groups.myGroups.invitations')}
        </AppButton>
      </View>

      {loading ? <LoadingState message={t('groups.myGroups.loading')} /> : null}
      {error ? (
        <ErrorState message={t('groups.myGroups.loadError')} onRetry={() => void refetch()} />
      ) : null}
      {!loading && !error && data?.myGroups ? (
        <GroupList groups={data.myGroups} onCreateGroup={() => router.push('/groups/new')} />
      ) : null}
    </Screen>
  )
}
