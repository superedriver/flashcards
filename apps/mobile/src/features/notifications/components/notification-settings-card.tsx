import { useEffect, useState } from 'react'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { usePushTokenRegistration } from '@/features/notifications/hooks/use-push-token-registration'
import { getNotificationPermissionStatus } from '@/features/notifications/services/notification-permission.service'
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

  const { registerCurrentDeviceToken, removeCurrentDeviceToken } = usePushTokenRegistration()
  const [updateSettings] = useUpdateMySettingsMutation({
    refetchQueries: ['MySettings'],
  })

  useEffect(() => {
    void getNotificationPermissionStatus().then(setPermissionStatus)
  }, [enabled])

  const handleEnable = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)
    setFeedback(null)

    try {
      const registration = await registerCurrentDeviceToken()

      if (!registration.granted) {
        setPermissionStatus(registration.status)
        setErrorMessage('Notification permission was denied.')
        return
      }

      if (!registration.success) {
        setErrorMessage('Could not register push token.')
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
      setFeedback('Notifications enabled.')
      setPermissionStatus(registration.status)
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, 'Could not enable notifications.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDisable = async () => {
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
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, 'Could not disable notifications.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppCard style={{ gap: 12, marginBottom: 16, padding: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>Notifications</AppText>
      <AppText>Status: {enabled ? 'Enabled' : 'Disabled'}</AppText>
      <AppText style={{ color: '#666666' }}>Permission: {permissionStatus}</AppText>

      {enabled ? (
        <AppButton disabled={isSubmitting} onPress={() => void handleDisable()}>
          Disable notifications
        </AppButton>
      ) : (
        <AppButton disabled={isSubmitting} onPress={() => void handleEnable()}>
          Enable notifications
        </AppButton>
      )}

      {feedback ? <AppText>{feedback}</AppText> : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
    </AppCard>
  )
}
