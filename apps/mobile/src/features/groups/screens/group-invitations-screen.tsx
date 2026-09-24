import type { ApolloCache } from '@apollo/client'
import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { GroupInvitationList } from '@/features/groups/components/group-invitation-list'
import {
  MyGroupInvitationsDocument,
  useAcceptGroupInvitationMutation,
  useDeclineGroupInvitationMutation,
  useMyGroupInvitationsQuery,
  type MyGroupInvitationsQuery,
} from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

function removeInvitationFromCache(cache: ApolloCache, invitationId: string) {
  const existing = cache.readQuery<MyGroupInvitationsQuery>({ query: MyGroupInvitationsDocument })

  if (!existing) {
    return
  }

  cache.writeQuery({
    query: MyGroupInvitationsDocument,
    data: {
      myGroupInvitations: existing.myGroupInvitations.filter(
        (invitation) => invitation.id !== invitationId,
      ),
    },
  })
}

export function GroupInvitationsScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const isSubmittingRef = useRef(false)
  const { data, error, loading, refetch } = useMyGroupInvitationsQuery()
  const [acceptInvitation] = useAcceptGroupInvitationMutation({
    refetchQueries: ['MyGroups'],
  })
  const [declineInvitation] = useDeclineGroupInvitationMutation()

  const handleAccept = async (invitationId: string) => {
    if (isSubmittingRef.current) {
      return
    }

    isSubmittingRef.current = true
    setSubmittingId(invitationId)
    setErrorMessage(null)

    try {
      const result = await acceptInvitation({
        update(cache) {
          removeInvitationFromCache(cache, invitationId)
        },
        variables: { invitationId },
      })

      if (!result.data?.acceptGroupInvitation.member.groupId) {
        setErrorMessage(t('groups.invitations.acceptError'))
        await refetch()
      }
    } catch (acceptError) {
      setErrorMessage(getGraphqlErrorMessage(acceptError, t('groups.invitations.acceptError')))
      await refetch()
    } finally {
      isSubmittingRef.current = false
      setSubmittingId(null)
    }
  }

  const handleDecline = async (invitationId: string) => {
    if (isSubmittingRef.current) {
      return
    }

    isSubmittingRef.current = true
    setSubmittingId(invitationId)
    setErrorMessage(null)

    try {
      const result = await declineInvitation({
        update(cache) {
          removeInvitationFromCache(cache, invitationId)
        },
        variables: { invitationId },
      })

      if (!result.data?.declineGroupInvitation) {
        setErrorMessage(t('groups.invitations.declineError'))
        await refetch()
      }
    } catch (declineError) {
      setErrorMessage(getGraphqlErrorMessage(declineError, t('groups.invitations.declineError')))
      await refetch()
    } finally {
      isSubmittingRef.current = false
      setSubmittingId(null)
    }
  }

  return (
    <Screen scrollable>
      <PageTitle title={t('groups.invitations.title')} />
      <AppText style={{ color: '#667085', marginBottom: 16 }}>
        {t('groups.invitations.subtitle')}
      </AppText>

      {loading ? <LoadingState message={t('groups.invitations.loading')} /> : null}
      {error ? (
        <ErrorState message={t('groups.invitations.loadError')} onRetry={() => void refetch()} />
      ) : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}

      {!loading && !error && data?.myGroupInvitations ? (
        <GroupInvitationList
          invitations={data.myGroupInvitations}
          isSubmittingId={submittingId}
          onAccept={(invitationId) => void handleAccept(invitationId)}
          onBackToGroups={() => router.push('/groups')}
          onDecline={(invitationId) => void handleDecline(invitationId)}
        />
      ) : null}
    </Screen>
  )
}
