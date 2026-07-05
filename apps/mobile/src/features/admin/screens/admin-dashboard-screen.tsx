import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { AdminStatsGrid } from '@/features/admin/components/admin-stats-grid'
import { getForbiddenMessage, isForbiddenError } from '@/features/admin/utils/is-forbidden-error'
import { useAdminDashboardStatsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function AdminDashboardScreen() {
  const { data, error, loading, refetch } = useAdminDashboardStatsQuery()

  if (loading) {
    return (
      <Screen>
        <PageTitle title="Admin Dashboard" />
        <LoadingState message="Loading dashboard..." />
      </Screen>
    )
  }

  if (error) {
    return (
      <Screen>
        <PageTitle title="Admin Dashboard" />
        <ErrorState
          message={
            isForbiddenError(error)
              ? getForbiddenMessage()
              : getGraphqlErrorMessage(error, 'Could not load dashboard stats.')
          }
          onRetry={isForbiddenError(error) ? undefined : () => void refetch()}
        />
      </Screen>
    )
  }

  return (
    <Screen scrollable>
      <PageTitle title="Admin Dashboard" />
      <AppText style={{ color: '#666666', marginBottom: 16 }}>
        Platform overview for administrators. Access is enforced on the server.
      </AppText>
      {data?.adminDashboardStats ? <AdminStatsGrid stats={data.adminDashboardStats} /> : null}
    </Screen>
  )
}
