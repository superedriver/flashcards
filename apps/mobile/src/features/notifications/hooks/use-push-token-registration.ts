import { useCallback } from 'react'
import { Platform } from 'react-native'

import {
  getExpoPushToken,
  requestNotificationPermission,
} from '@/features/notifications/services/notification-permission.service'
import {
  clearCurrentPushToken,
  getCurrentPushToken,
  setCurrentPushToken,
} from '@/features/notifications/services/current-push-token-memory'
import { useRegisterPushTokenMutation, useRemovePushTokenMutation } from '@/graphql/generated'

export function usePushTokenRegistration() {
  const [registerPushToken] = useRegisterPushTokenMutation()
  const [removePushToken] = useRemovePushTokenMutation()

  const registerCurrentDeviceToken = useCallback(async (): Promise<{
    granted: boolean
    status: string
    success: boolean
  }> => {
    const permission = await requestNotificationPermission()

    if (!permission.granted) {
      return { ...permission, success: false }
    }

    const token = await getExpoPushToken()

    if (!token) {
      return { granted: true, status: permission.status, success: false }
    }

    const result = await registerPushToken({
      variables: {
        input: {
          platform: Platform.OS,
          token,
        },
      },
    })

    if (!result.data?.registerPushToken.success) {
      return { granted: true, status: permission.status, success: false }
    }

    setCurrentPushToken(token)

    return { granted: true, status: permission.status, success: true }
  }, [registerPushToken])

  const removeCurrentDeviceToken = useCallback(async (): Promise<boolean> => {
    const token = getCurrentPushToken()

    if (!token) {
      clearCurrentPushToken()
      return true
    }

    try {
      const result = await removePushToken({
        variables: {
          input: { token },
        },
      })

      clearCurrentPushToken()

      return Boolean(result.data?.removePushToken)
    } catch {
      clearCurrentPushToken()
      return false
    }
  }, [removePushToken])

  return {
    clearCurrentPushToken,
    getCurrentPushToken,
    registerCurrentDeviceToken,
    removeCurrentDeviceToken,
  }
}
