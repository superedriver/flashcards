import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
      t('groups.invitations.acceptTitle'),
      t('groups.invitations.acceptMessage'),
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
              setErrorMessage(t('groups.invitations.acceptError'))
              return
            }

            setFeedback(t('groups.invitations.acceptSuccess'))
            await refetch()
            router.push(`/groups/${groupId}`)
          } catch (acceptError) {
            setErrorMessage(
              getGraphqlErrorMessage(acceptError, t('groups.invitations.acceptError')),
            )
          } finally {
            isSubmittingRef.current = false
          }
        })()
      },
    )
  }

  const handleDecline = (invitationId: string) => {
    confirmDestructiveAction(
      t('groups.invitations.declineTitle'),
      t('groups.invitations.declineMessage'),
      () => {
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
              setErrorMessage(t('groups.invitations.declineError'))
              return
            }

            setFeedback(t('groups.invitations.declineSuccess'))
            await refetch()
          } catch (declineError) {
            setErrorMessage(
              getGraphqlErrorMessage(declineError, t('groups.invitations.declineError')),
            )
          } finally {
            isSubmittingRef.current = false
          }
        })()
      },
    )
  }

  return (
    <Screen scrollable>
      <PageTitle title={t('groups.invitations.title')} />
      <AppText style={{ color: '#666666', marginBottom: 12 }}>
        {t('groups.invitations.subtitle')}
      </AppText>

      {loading ? <LoadingState message={t('groups.invitations.loading')} /> : null}
      {error ? (
        <ErrorState message={t('groups.invitations.loadError')} onRetry={() => void refetch()} />
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
