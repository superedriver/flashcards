import { AppCard, AppText } from '@/ui/primitives'

type AdminStatCardProps = {
  label: string
  value: number
}

export function AdminStatCard({ label, value }: AdminStatCardProps) {
  return (
    <AppCard style={{ gap: 4, marginBottom: 12, padding: 16 }}>
      <AppText style={{ color: '#666666' }}>{label}</AppText>
      <AppText style={{ fontSize: 24, fontWeight: '600' }}>{value}</AppText>
    </AppCard>
  )
}
