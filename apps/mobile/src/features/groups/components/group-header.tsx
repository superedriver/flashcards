import type { GroupQuery } from '@/graphql/generated'
import { AppCard, AppText } from '@/ui/primitives'

type GroupHeaderProps = {
  group: NonNullable<GroupQuery['group']>
}

export function GroupHeader({ group }: GroupHeaderProps) {
  return (
    <AppCard style={{ gap: 8, marginBottom: 16, padding: 16 }}>
      <AppText style={{ fontSize: 20, fontWeight: '600' }}>{group.name}</AppText>
      {group.description ? (
        <AppText style={{ color: '#666666' }}>{group.description}</AppText>
      ) : null}
    </AppCard>
  )
}
