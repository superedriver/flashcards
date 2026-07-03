import { useRouter } from 'expo-router'
import { View } from 'react-native'

import { AppButton } from '@/ui/primitives'

type GroupActionsProps = {
  groupId: string
  onInvitePress: () => void
}

export function GroupActions({ groupId, onInvitePress }: GroupActionsProps) {
  const router = useRouter()

  return (
    <View style={{ gap: 12, marginBottom: 16 }}>
      <AppButton onPress={onInvitePress}>Invite User</AppButton>
      <AppButton onPress={() => router.push(`/groups/${groupId}/share-deck`)}>Share Deck</AppButton>
    </View>
  )
}
