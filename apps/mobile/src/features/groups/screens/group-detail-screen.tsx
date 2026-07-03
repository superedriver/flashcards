import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import { GroupActions } from '@/features/groups/components/group-actions'
import { GroupHeader } from '@/features/groups/components/group-header'
import { GroupSharedDeckList } from '@/features/groups/components/group-shared-deck-list'
import { InviteUserForm } from '@/features/groups/components/invite-user-form'
import { useGroupQuery, useGroupSharedDecksQuery } from '@/graphql/generated'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function GroupDetailScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>()
  const [showInviteForm, setShowInviteForm] = useState(false)

  const {
    data: groupData,
    error: groupError,
    loading: groupLoading,
  } = useGroupQuery({
    skip: !groupId,
    variables: { id: groupId ?? '' },
  })

  const {
    data: sharedDecksData,
    error: sharedDecksError,
    loading: sharedDecksLoading,
  } = useGroupSharedDecksQuery({
    skip: !groupId,
    variables: { groupId: groupId ?? '' },
  })

  const group = groupData?.group
  const loading = groupLoading || sharedDecksLoading
  const error = groupError ?? sharedDecksError

  return (
    <Screen>
      <PageTitle title="Group" />

      {loading ? <LoadingState message="Loading group..." /> : null}
      {error ? <ErrorState message="Could not load group." /> : null}

      {group && groupId ? (
        <View style={{ gap: 12 }}>
          <GroupHeader group={group} />
          <GroupActions
            groupId={groupId}
            onInvitePress={() => setShowInviteForm((current) => !current)}
          />
          {showInviteForm ? <InviteUserForm groupId={groupId} /> : null}
          {sharedDecksData?.groupSharedDecks ? (
            <GroupSharedDeckList decks={sharedDecksData.groupSharedDecks} />
          ) : null}
        </View>
      ) : null}
    </Screen>
  )
}
