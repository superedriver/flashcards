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
    { style: 'cancel', text: 'Cancel' },
    { onPress: onConfirm, style: 'destructive', text: 'Confirm' },
  ])
}
