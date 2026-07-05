import { useRouter } from 'expo-router'
import { View } from 'react-native'

import { GroupList } from '@/features/groups/components/group-list'
import { useMyGroupsQuery } from '@/graphql/generated'
import { AppButton } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function MyGroupsScreen() {
  const router = useRouter()
  const { data, error, loading, refetch } = useMyGroupsQuery()

  return (
    <Screen>
      <PageTitle title="My Groups" />
      <View style={{ gap: 12, marginBottom: 16 }}>
        <AppButton onPress={() => router.push('/groups/new')}>Create Group</AppButton>
        <AppButton onPress={() => router.push('/groups/invitations')}>Invitations</AppButton>
      </View>

      {loading ? <LoadingState message="Loading groups..." /> : null}
      {error ? (
        <ErrorState message="Could not load groups." onRetry={() => void refetch()} />
      ) : null}
      {!loading && !error && data?.myGroups ? (
        <GroupList groups={data.myGroups} onCreateGroup={() => router.push('/groups/new')} />
      ) : null}
    </Screen>
  )
}
