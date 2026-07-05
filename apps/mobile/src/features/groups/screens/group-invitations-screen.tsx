import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'

import { confirmAction, confirmDestructiveAction } from '@/features/decks/utils/confirm-destructive'
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
  const isSubmittingRef = useRef(false)
  const { data, error, loading, refetch } = useMyGroupInvitationsQuery()
  const [acceptInvitation, { loading: isAccepting }] = useAcceptGroupInvitationMutation({
    refetchQueries: ['MyGroupInvitations', 'MyGroups'],
  })
  const [declineInvitation, { loading: isDeclining }] = useDeclineGroupInvitationMutation({
    refetchQueries: ['MyGroupInvitations'],
  })

  const isSubmitting = isAccepting || isDeclining

  const handleAccept = (invitationId: string) => {
    confirmAction(
      'Accept invitation',
      'You will join this group and can access its shared decks.',
      () => {
        void (async () => {
          if (isSubmittingRef.current || isSubmitting) {
            return
          }

          isSubmittingRef.current = true
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
          } finally {
            isSubmittingRef.current = false
          }
        })()
      },
    )
  }

  const handleDecline = (invitationId: string) => {
    confirmDestructiveAction('Decline invitation', 'You will not be added to this group.', () => {
      void (async () => {
        if (isSubmittingRef.current || isSubmitting) {
          return
        }

        isSubmittingRef.current = true
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
        } finally {
          isSubmittingRef.current = false
        }
      })()
    })
  }

  return (
    <Screen scrollable>
      <PageTitle title="Group Invitations" />
      <AppText style={{ color: '#666666', marginBottom: 12 }}>
        Accept invitations to join groups and access shared decks.
      </AppText>

      {loading ? <LoadingState message="Loading invitations..." /> : null}
      {error ? (
        <ErrorState message="Could not load invitations." onRetry={() => void refetch()} />
      ) : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      {feedback ? (
        <AppText style={{ color: '#2e7d32', fontWeight: '600' }}>{feedback}</AppText>
      ) : null}

      {!loading && !error && data?.myGroupInvitations ? (
        <GroupInvitationList
          invitations={data.myGroupInvitations}
          isSubmitting={isSubmitting}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      ) : null}
    </Screen>
  )
}
