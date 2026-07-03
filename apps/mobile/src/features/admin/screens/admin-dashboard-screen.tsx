import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { AdminStatsGrid } from '@/features/admin/components/admin-stats-grid'
import { useAdminDashboardStatsQuery } from '@/graphql/generated'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

function isForbiddenError(error: unknown): boolean {
  if (error instanceof Error && 'graphQLErrors' in error) {
    const message = (error as { graphQLErrors: Array<{ message?: string }> }).graphQLErrors[0]
      ?.message

    return Boolean(message?.toLowerCase().includes('forbidden') || message?.includes('403'))
  }

  return false
}

export function AdminDashboardScreen() {
  const { data, error, loading } = useAdminDashboardStatsQuery()

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
              ? 'You do not have permission to view the admin dashboard.'
              : getGraphqlErrorMessage(error, 'Could not load dashboard stats.')
          }
        />
      </Screen>
    )
  }

  return (
    <Screen>
      <PageTitle title="Admin Dashboard" />
      {data?.adminDashboardStats ? <AdminStatsGrid stats={data.adminDashboardStats} /> : null}
    </Screen>
  )
}
