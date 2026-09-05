import { i18n } from '@/i18n'
import { Alert, Platform } from 'react-native'

export function confirmDestructiveAction(
  title: string,
  message: string,
  onConfirm: () => void,
): void {
  if (Platform.OS === 'web') {
    if (globalThis.confirm(`${title}\n\n${message}`)) {
      onConfirm()
    }

    return
  }

  Alert.alert(title, message, [
    { style: 'cancel', text: i18n.t('common.cancel') },
    { onPress: onConfirm, style: 'destructive', text: i18n.t('common.confirm') },
  ])
}

export function confirmAction(title: string, message: string, onConfirm: () => void): void {
  if (Platform.OS === 'web') {
    if (globalThis.confirm(`${title}\n\n${message}`)) {
      onConfirm()
    }

    return
  }

  Alert.alert(title, message, [
    { style: 'cancel', text: i18n.t('common.cancel') },
    { onPress: onConfirm, text: i18n.t('common.confirm') },
  ])
}

export function confirmActionAsync(title: string, message: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (Platform.OS === 'web') {
      resolve(globalThis.confirm(`${title}\n\n${message}`))
      return
    }

    Alert.alert(
      title,
      message,
      [
        { onPress: () => resolve(false), style: 'cancel', text: i18n.t('common.cancel') },
        { onPress: () => resolve(true), text: i18n.t('common.confirm') },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    )
  })
}
