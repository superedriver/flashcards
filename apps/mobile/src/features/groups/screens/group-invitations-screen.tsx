import { useRouter } from 'expo-router'
import { useState } from 'react'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { GroupInvitationList } from '@/features/groups/components/group-invitation-list'
import {
  useAcceptGroupInvitationMutation,
  useDeclineGroupInvitationMutation,
  useMyGroupInvitationsQuery,
} from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function GroupInvitationsScreen() {
  const router = useRouter()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { data, error, loading, refetch } = useMyGroupInvitationsQuery()
  const [acceptInvitation, { loading: isAccepting }] = useAcceptGroupInvitationMutation({
    refetchQueries: ['MyGroupInvitations', 'MyGroups'],
  })
  const [declineInvitation, { loading: isDeclining }] = useDeclineGroupInvitationMutation({
    refetchQueries: ['MyGroupInvitations'],
  })

  const isSubmitting = isAccepting || isDeclining

  const handleAccept = async (invitationId: string) => {
    setErrorMessage(null)
    setFeedback(null)

    try {
      const result = await acceptInvitation({
        variables: { invitationId },
      })

      const groupId = result.data?.acceptGroupInvitation.member.groupId

      if (!groupId) {
        setErrorMessage('Could not accept invitation.')
        return
      }

      setFeedback('Invitation accepted.')
      await refetch()
      router.push(`/groups/${groupId}`)
    } catch (acceptError) {
      setErrorMessage(getGraphqlErrorMessage(acceptError, 'Could not accept invitation.'))
    }
  }

  const handleDecline = async (invitationId: string) => {
    setErrorMessage(null)
    setFeedback(null)

    try {
      const result = await declineInvitation({
        variables: { invitationId },
      })

      if (!result.data?.declineGroupInvitation) {
        setErrorMessage('Could not decline invitation.')
        return
      }

      setFeedback('Invitation declined.')
      await refetch()
    } catch (declineError) {
      setErrorMessage(getGraphqlErrorMessage(declineError, 'Could not decline invitation.'))
    }
  }

  return (
    <Screen>
      <PageTitle title="Group Invitations" />

      {loading ? <LoadingState message="Loading invitations..." /> : null}
      {error ? (
        <ErrorState message="Could not load invitations." onRetry={() => void refetch()} />
      ) : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      {feedback ? <AppText>{feedback}</AppText> : null}

      {!loading && !error && data?.myGroupInvitations ? (
        <GroupInvitationList
          invitations={data.myGroupInvitations}
          isSubmitting={isSubmitting}
          onAccept={(invitationId) => void handleAccept(invitationId)}
          onDecline={(invitationId) => void handleDecline(invitationId)}
        />
      ) : null}
    </Screen>
  )
}
