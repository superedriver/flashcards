import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { confirmDestructiveAction } from '@/features/decks/utils/confirm-destructive'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { AdminUserList } from '@/features/admin/components/admin-user-list'
import { AdminUserSearch } from '@/features/admin/components/admin-user-search'
import { getForbiddenMessage, isForbiddenError } from '@/features/admin/utils/is-forbidden-error'
import {
  useAdminSearchUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
} from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function AdminUsersScreen() {
  const { t } = useTranslation()
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
    confirmDestructiveAction(
      t('admin.users.blockConfirmTitle'),
      t('admin.users.blockConfirmMessage'),
      () => {
        void (async () => {
          setErrorMessage(null)
          setFeedback(null)

          try {
            const result = await blockUser({ variables: { userId } })

            if (!result.data?.blockUser) {
              setErrorMessage(t('admin.users.blockError'))
              return
            }

            setFeedback(t('admin.users.blockSuccess'))
            await refetch()
          } catch (blockError) {
            setErrorMessage(getGraphqlErrorMessage(blockError, t('admin.users.blockError')))
          }
        })()
      },
    )
  }

  const handleUnblock = (userId: string) => {
    confirmDestructiveAction(
      t('admin.users.unblockConfirmTitle'),
      t('admin.users.unblockConfirmMessage'),
      () => {
        void (async () => {
          setErrorMessage(null)
          setFeedback(null)

          try {
            const result = await unblockUser({ variables: { userId } })

            if (!result.data?.unblockUser) {
              setErrorMessage(t('admin.users.unblockError'))
              return
            }

            setFeedback(t('admin.users.unblockSuccess'))
            await refetch()
          } catch (unblockError) {
            setErrorMessage(getGraphqlErrorMessage(unblockError, t('admin.users.unblockError')))
          }
        })()
      },
    )
  }

  const queryErrorMessage = error
    ? isForbiddenError(error)
      ? getForbiddenMessage()
      : t('admin.users.searchError')
    : null

  return (
    <Screen scrollable>
      <PageTitle title={t('profile.userManagement')} />
      <AppText style={{ color: '#666666', marginBottom: 12 }}>{t('admin.users.subtitle')}</AppText>
      <View style={{ gap: 12, marginBottom: 16 }}>
        <AdminUserSearch value={query} onQueryChange={handleQueryChange} />
      </View>

      {loading ? <LoadingState message={t('admin.users.searching')} /> : null}
      {queryErrorMessage ? (
        <ErrorState
          message={queryErrorMessage}
          onRetry={isForbiddenError(error) ? undefined : () => void refetch()}
        />
      ) : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      {feedback ? (
        <AppText style={{ color: '#2e7d32', fontWeight: '600' }}>{feedback}</AppText>
      ) : null}

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
