import type { MyGroupsQuery } from '@/graphql/generated'
import { AppCard, AppText } from '@/ui/primitives'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

type GroupListItemProps = {
  group: MyGroupsQuery['myGroups'][number]
}

export function GroupListItem({ group }: GroupListItemProps) {
  const router = useRouter()

  return (
    <Pressable onPress={() => router.push(`/groups/${group.id}`)}>
      <AppCard style={{ gap: 8, marginBottom: 12, padding: 16 }}>
        <AppText style={{ fontSize: 18, fontWeight: '600' }}>{group.name}</AppText>
        {group.description ? (
          <AppText style={{ color: '#666666' }}>{group.description}</AppText>
        ) : null}
      </AppCard>
    </Pressable>
  )
}
