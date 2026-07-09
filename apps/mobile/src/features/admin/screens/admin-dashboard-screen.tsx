import { useTranslation } from 'react-i18next'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { AdminStatsGrid } from '@/features/admin/components/admin-stats-grid'
import { getForbiddenMessage, isForbiddenError } from '@/features/admin/utils/is-forbidden-error'
import { useAdminDashboardStatsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function AdminDashboardScreen() {
  const { t } = useTranslation()
  const { data, error, loading, refetch } = useAdminDashboardStatsQuery()

  if (loading) {
    return (
      <Screen>
        <PageTitle title={t('profile.adminDashboard')} />
        <LoadingState message={t('admin.dashboard.loading')} />
      </Screen>
    )
  }

  if (error) {
    return (
      <Screen>
        <PageTitle title={t('profile.adminDashboard')} />
        <ErrorState
          message={
            isForbiddenError(error)
              ? getForbiddenMessage()
              : getGraphqlErrorMessage(error, t('admin.dashboard.loadError'))
          }
          onRetry={isForbiddenError(error) ? undefined : () => void refetch()}
        />
      </Screen>
    )
  }

  return (
    <Screen scrollable>
      <PageTitle title={t('profile.adminDashboard')} />
      <AppText style={{ color: '#666666', marginBottom: 16 }}>
        {t('admin.dashboard.subtitle')}
      </AppText>
      {data?.adminDashboardStats ? <AdminStatsGrid stats={data.adminDashboardStats} /> : null}
    </Screen>
  )
}
