import { useEffect, useRef, useState } from 'react'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { usePushTokenRegistration } from '@/features/notifications/hooks/use-push-token-registration'
import { getNotificationPermissionStatus } from '@/features/notifications/services/notification-permission.service'
import { formatPermissionStatus } from '@/features/notifications/utils/format-permission-status'
import { useUpdateMySettingsMutation } from '@/graphql/generated'
import { AppButton, AppCard, AppText } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

type NotificationSettingsCardProps = {
  enabled: boolean
  onEnabledChange: (value: boolean) => void
}

export function NotificationSettingsCard({
  enabled,
  onEnabledChange,
}: NotificationSettingsCardProps) {
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSubmittingRef = useRef(false)

  const { registerCurrentDeviceToken, removeCurrentDeviceToken } = usePushTokenRegistration()
  const [updateSettings] = useUpdateMySettingsMutation({
    refetchQueries: ['MySettings'],
  })

  useEffect(() => {
    void getNotificationPermissionStatus().then(setPermissionStatus)
  }, [enabled])

  const permissionInfo = formatPermissionStatus(permissionStatus)

  const handleEnable = async () => {
    if (isSubmittingRef.current || isSubmitting) {
      return
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)
    setErrorMessage(null)
    setFeedback(null)

    try {
      const registration = await registerCurrentDeviceToken()

      if (!registration.granted) {
        setPermissionStatus(registration.status)
        const deniedInfo = formatPermissionStatus(registration.status)
        setErrorMessage(
          deniedInfo.description ??
            'Notification permission was denied. Enable notifications in your device settings and try again.',
        )
        return
      }

      if (!registration.success) {
        setErrorMessage('Could not register this device for notifications. Please try again.')
        return
      }

      const result = await updateSettings({
        variables: {
          input: {
            notificationsEnabled: true,
          },
        },
      })

      if (!result.data?.updateSettings) {
        setErrorMessage('Could not enable notifications.')
        return
      }

      onEnabledChange(true)
      setFeedback('Notifications enabled for this device.')
      setPermissionStatus(registration.status)
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, 'Could not enable notifications.'))
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  const handleDisable = async () => {
    if (isSubmittingRef.current || isSubmitting) {
      return
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)
    setErrorMessage(null)
    setFeedback(null)

    try {
      await removeCurrentDeviceToken()

      const result = await updateSettings({
        variables: {
          input: {
            notificationsEnabled: false,
          },
        },
      })

      if (!result.data?.updateSettings) {
        setErrorMessage('Could not disable notifications.')
        return
      }

      onEnabledChange(false)
      setFeedback('Notifications disabled.')
      setPermissionStatus(await getNotificationPermissionStatus())
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, 'Could not disable notifications.'))
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <AppCard style={{ gap: 12, marginBottom: 16, padding: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>Push notifications</AppText>
      <AppText style={{ color: '#666666', fontSize: 14 }}>
        Receive due-card reminders on this device. Your push token is stored securely and never
        shown here.
      </AppText>
      <AppText>
        App setting:{' '}
        <AppText style={{ fontWeight: '600' }}>{enabled ? 'Enabled' : 'Disabled'}</AppText>
      </AppText>
      <AppText>
        Device permission:{' '}
        <AppText style={{ color: permissionInfo.color, fontWeight: '600' }}>
          {permissionInfo.label}
        </AppText>
      </AppText>
      {permissionInfo.description ? (
        <AppText style={{ color: '#666666', fontSize: 14 }}>{permissionInfo.description}</AppText>
      ) : null}

      {enabled ? (
        <AppButton disabled={isSubmitting} onPress={() => void handleDisable()}>
          {isSubmitting ? 'Updating...' : 'Disable notifications'}
        </AppButton>
      ) : (
        <AppButton
          disabled={isSubmitting || permissionStatus === 'unsupported'}
          onPress={() => void handleEnable()}
        >
          {isSubmitting ? 'Enabling...' : 'Enable notifications'}
        </AppButton>
      )}

      {feedback ? (
        <AppText style={{ color: '#2e7d32', fontWeight: '600' }}>{feedback}</AppText>
      ) : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
    </AppCard>
  )
}
