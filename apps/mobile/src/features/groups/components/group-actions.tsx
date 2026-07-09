import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AppButton } from '@/ui/primitives'

type GroupActionsProps = {
  groupId: string
  onInvitePress: () => void
}

export function GroupActions({ groupId, onInvitePress }: GroupActionsProps) {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <View style={{ gap: 12, marginBottom: 16 }}>
      <AppButton onPress={onInvitePress}>{t('groups.actions.inviteUser')}</AppButton>
      <AppButton onPress={() => router.push(`/groups/${groupId}/share-deck`)}>
        {t('groups.actions.shareDeck')}
      </AppButton>
    </View>
  )
}
