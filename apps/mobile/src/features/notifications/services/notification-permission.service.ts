import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

export type NotificationPermissionResult = {
  granted: boolean
  status: string
}

type NotificationPermissionSettings = Notifications.NotificationPermissionsStatus & {
  granted?: boolean
  status?: string
}

function isNotificationPermissionGranted(
  permission: Notifications.NotificationPermissionsStatus,
): boolean {
  const settings = permission as NotificationPermissionSettings

  return (
    settings.granted === true ||
    settings.status === 'granted' ||
    permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
    permission.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED
  )
}

export async function requestNotificationPermission(): Promise<NotificationPermissionResult> {
  if (Platform.OS === 'web') {
    return { granted: false, status: 'unsupported' }
  }

  const existing = await Notifications.getPermissionsAsync()

  if (isNotificationPermissionGranted(existing)) {
    return { granted: true, status: 'granted' }
  }

  const requested = await Notifications.requestPermissionsAsync()

  const granted = isNotificationPermissionGranted(requested)

  return {
    granted,
    status: granted ? 'granted' : 'denied',
  }
}

export async function getExpoPushToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return null
  }

  const permission = await Notifications.getPermissionsAsync()

  if (!isNotificationPermissionGranted(permission)) {
    return null
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId ?? undefined

  try {
    const token = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined)

    return token.data
  } catch {
    return null
  }
}

export async function getNotificationPermissionStatus(): Promise<string> {
  if (Platform.OS === 'web') {
    return 'unsupported'
  }

  const permission = await Notifications.getPermissionsAsync()
  return isNotificationPermissionGranted(permission) ? 'granted' : 'denied'
}
