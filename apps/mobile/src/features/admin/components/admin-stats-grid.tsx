import { View } from 'react-native'

import type { AdminDashboardStatsQuery } from '@/graphql/generated'
import { responsiveGridItemStyle, responsiveGridStyle } from '@/ui/utils/responsive'

import { AdminStatCard } from './admin-stat-card'

type AdminStatsGridProps = {
  stats: AdminDashboardStatsQuery['adminDashboardStats']
}

export function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  const items = [
    { label: 'Total users', value: stats.totalUsers },
    { label: 'Total decks', value: stats.totalDecks },
    { label: 'Public decks', value: stats.totalPublicDecks },
    { label: 'Total cards', value: stats.totalCards },
    { label: 'Study sessions', value: stats.totalStudySessions },
    { label: 'Reviews', value: stats.totalReviews },
    { label: 'Users (7 days)', value: stats.usersCreatedLast7Days },
    { label: 'Decks (7 days)', value: stats.decksCreatedLast7Days },
    { label: 'Reviews (7 days)', value: stats.reviewsSubmittedLast7Days },
  ]

  return (
    <View style={responsiveGridStyle}>
      {items.map((item) => (
        <View key={item.label} style={responsiveGridItemStyle}>
          <AdminStatCard label={item.label} value={item.value} />
        </View>
      ))}
    </View>
  )
}
