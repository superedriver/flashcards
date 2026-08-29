import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { GroupActionCard } from '@/features/groups/components/group-action-card'
import { GroupList } from '@/features/groups/components/group-list'
import { useMyGroupsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function MyGroupsScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { data, error, loading, refetch } = useMyGroupsQuery()

  return (
    <Screen scrollable>
      <PageTitle title={t('groups.myGroups.title')} />
      <AppText style={{ color: '#667085', marginBottom: 16 }}>
        {t('groups.myGroups.subtitle')}
      </AppText>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <View style={{ flex: 1, minWidth: 220 }}>
          <GroupActionCard
            icon="person-add-outline"
            label={t('groups.myGroups.createGroup')}
            subtitle={t('groups.myGroups.createGroupHint')}
            onPress={() => router.push('/groups/new')}
          />
        </View>
        <View style={{ flex: 1, minWidth: 220 }}>
          <GroupActionCard
            icon="mail-outline"
            label={t('groups.myGroups.invitations')}
            subtitle={t('groups.myGroups.invitationsHint')}
            onPress={() => router.push('/groups/invitations')}
          />
        </View>
      </View>

      {loading ? <LoadingState message={t('groups.myGroups.loading')} /> : null}
      {error ? (
        <ErrorState message={t('groups.myGroups.loadError')} onRetry={() => void refetch()} />
      ) : null}
      {!loading && !error && data?.myGroups ? (
        <GroupList groups={data.myGroups} onCreateGroup={() => router.push('/groups/new')} />
      ) : null}

      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 6,
          justifyContent: 'center',
          marginTop: 20,
          paddingHorizontal: 12,
        }}
      >
        <Ionicons color="#98a2b3" name="shield-outline" size={14} />
        <AppText style={{ color: '#98a2b3', flexShrink: 1, fontSize: 12, textAlign: 'center' }}>
          {t('groups.myGroups.viewOnlyNote')}
        </AppText>
      </View>
    </Screen>
  )
}
