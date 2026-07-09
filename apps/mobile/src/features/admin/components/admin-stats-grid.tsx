import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { AdminDashboardStatsQuery } from '@/graphql/generated'
import { responsiveGridItemStyle, responsiveGridStyle } from '@/ui/utils/responsive'

import { AdminStatCard } from './admin-stat-card'

type AdminStatsGridProps = {
  stats: AdminDashboardStatsQuery['adminDashboardStats']
}

export function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  const { t } = useTranslation()

  const items = [
    { key: 'totalUsers', value: stats.totalUsers },
    { key: 'totalDecks', value: stats.totalDecks },
    { key: 'publicDecks', value: stats.totalPublicDecks },
    { key: 'totalCards', value: stats.totalCards },
    { key: 'studySessions', value: stats.totalStudySessions },
    { key: 'reviews', value: stats.totalReviews },
    { key: 'usersLast7Days', value: stats.usersCreatedLast7Days },
    { key: 'decksLast7Days', value: stats.decksCreatedLast7Days },
    { key: 'reviewsLast7Days', value: stats.reviewsSubmittedLast7Days },
  ] as const

  return (
    <View style={responsiveGridStyle}>
      {items.map((item) => (
        <View key={item.key} style={responsiveGridItemStyle}>
          <AdminStatCard label={t(`admin.dashboard.stats.${item.key}`)} value={item.value} />
        </View>
      ))}
    </View>
  )
}
