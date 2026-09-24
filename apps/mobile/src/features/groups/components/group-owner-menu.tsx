import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, View } from 'react-native'

import { AppText } from '@/ui/primitives'

type GroupOwnerMenuProps = {
  groupId: string
}

export function GroupOwnerMenu({ groupId }: GroupOwnerMenuProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <View>
      <Pressable
        accessibilityLabel={t('groups.myGroups.manageA11y')}
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => setOpen(true)}
        style={{
          alignItems: 'center',
          height: 32,
          justifyContent: 'center',
          width: 28,
        }}
      >
        <Ionicons color="#667085" name="ellipsis-vertical" size={16} />
      </Pressable>

      <Modal animationType="fade" transparent visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable
          onPress={() => setOpen(false)}
          style={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            flex: 1,
            justifyContent: 'flex-end',
            padding: 16,
          }}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              overflow: 'hidden',
              paddingVertical: 8,
            }}
          >
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setOpen(false)
                router.push(`/groups/${groupId}`)
              }}
              style={{ paddingHorizontal: 16, paddingVertical: 14 }}
            >
              <AppText style={{ fontSize: 16 }}>{t('groups.actions.inviteUser')}</AppText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setOpen(false)
                router.push(`/groups/${groupId}/share-deck`)
              }}
              style={{ paddingHorizontal: 16, paddingVertical: 14 }}
            >
              <AppText style={{ fontSize: 16 }}>{t('groups.actions.shareDeck')}</AppText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setOpen(false)}
              style={{ paddingHorizontal: 16, paddingVertical: 14 }}
            >
              <AppText style={{ color: '#667085', fontSize: 16 }}>{t('common.cancel')}</AppText>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}
