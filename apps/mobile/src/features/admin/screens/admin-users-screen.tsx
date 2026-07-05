import { useCallback, useState } from 'react'
import { View } from 'react-native'

import { confirmDestructiveAction } from '@/features/decks/utils/confirm-destructive'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { AdminUserList } from '@/features/admin/components/admin-user-list'
import { AdminUserSearch } from '@/features/admin/components/admin-user-search'
import {
  useAdminSearchUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
} from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function AdminUsersScreen() {
  const [query, setQuery] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data, error, loading, refetch } = useAdminSearchUsersQuery({
    variables: {
      input: query ? { query } : undefined,
    },
  })

  const [blockUser, { loading: isBlocking }] = useBlockUserMutation()
  const [unblockUser, { loading: isUnblocking }] = useUnblockUserMutation()
  const isSubmitting = isBlocking || isUnblocking

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value)
  }, [])

  const handleBlock = (userId: string) => {
    confirmDestructiveAction('Block user', 'This user will be blocked from the platform.', () => {
      void (async () => {
        setErrorMessage(null)
        setFeedback(null)

        try {
          const result = await blockUser({ variables: { userId } })

          if (!result.data?.blockUser) {
            setErrorMessage('Could not block user.')
            return
          }

          setFeedback('User blocked.')
          await refetch()
        } catch (blockError) {
          setErrorMessage(getGraphqlErrorMessage(blockError, 'Could not block user.'))
        }
      })()
    })
  }

  const handleUnblock = (userId: string) => {
    confirmDestructiveAction(
      'Unblock user',
      'This user will regain access to the platform.',
      () => {
        void (async () => {
          setErrorMessage(null)
          setFeedback(null)

          try {
            const result = await unblockUser({ variables: { userId } })

            if (!result.data?.unblockUser) {
              setErrorMessage('Could not unblock user.')
              return
            }

            setFeedback('User unblocked.')
            await refetch()
          } catch (unblockError) {
            setErrorMessage(getGraphqlErrorMessage(unblockError, 'Could not unblock user.'))
          }
        })()
      },
    )
  }

  return (
    <Screen>
      <PageTitle title="User Management" />
      <View style={{ gap: 12, marginBottom: 16 }}>
        <AdminUserSearch value={query} onQueryChange={handleQueryChange} />
      </View>

      {loading ? <LoadingState message="Searching users..." /> : null}
      {error ? (
        <ErrorState message="Could not search users." onRetry={() => void refetch()} />
      ) : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      {feedback ? <AppText>{feedback}</AppText> : null}

      {!loading && !error && data?.adminSearchUsers ? (
        <AdminUserList
          isSubmitting={isSubmitting}
          users={data.adminSearchUsers.items}
          onBlock={handleBlock}
          onUnblock={handleUnblock}
        />
      ) : null}
    </Screen>
  )
}
