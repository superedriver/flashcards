import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'

import { GroupActions } from '@/features/groups/components/group-actions'
import { GroupHeader } from '@/features/groups/components/group-header'
import { useGroupQuery } from '@/graphql/generated'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function GroupDetailScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>()

  const { data, error, loading } = useGroupQuery({
    skip: !groupId,
    variables: { id: groupId ?? '' },
  })

  const group = data?.group

  return (
    <Screen>
      <PageTitle title="Group" />

      {loading ? <LoadingState message="Loading group..." /> : null}
      {error ? <ErrorState message="Could not load group." /> : null}

      {group && groupId ? (
        <View style={{ gap: 12 }}>
          <GroupHeader group={group} />
          <GroupActions groupId={groupId} onInvitePress={() => undefined} />
        </View>
      ) : null}
    </Screen>
  )
}
