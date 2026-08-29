import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, View } from 'react-native'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { usePushTokenRegistration } from '@/features/notifications/hooks/use-push-token-registration'
import { getNotificationPermissionStatus } from '@/features/notifications/services/notification-permission.service'
import { SettingsLabeledRow } from '@/features/settings/components/settings-labeled-row'
import { useMySettingsQuery, useUpdateMySettingsMutation } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

export function NotificationSettingsCard() {
  const { t } = useTranslation()
  const { data } = useMySettingsQuery()
  const enabled = Boolean(data?.myAccount.settings.notificationsEnabled)
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSubmittingRef = useRef(false)

  const { registerCurrentDeviceToken, removeCurrentDeviceToken } = usePushTokenRegistration()
  const [updateSettings] = useUpdateMySettingsMutation({
    refetchQueries: ['MySettings'],
  })

  useEffect(() => {
    void getNotificationPermissionStatus().then(setPermissionStatus)
  }, [enabled])

  const handleEnable = async () => {
    if (isSubmittingRef.current || isSubmitting) {
      return
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const registration = await registerCurrentDeviceToken()

      if (!registration.granted) {
        setPermissionStatus(registration.status)
        setErrorMessage(t('settings.notifications.permissionDenied'))
        return
      }

      if (!registration.success) {
        setErrorMessage(t('settings.notifications.enableError'))
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
        setErrorMessage(t('settings.notifications.enableError'))
        return
      }

      setPermissionStatus(registration.status)
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, t('settings.notifications.enableError')))
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
        setErrorMessage(t('settings.notifications.disableError'))
        return
      }

      setPermissionStatus(await getNotificationPermissionStatus())
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, t('settings.notifications.disableError')))
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  if (Platform.OS === 'web') {
    return (
      <SettingsLabeledRow
        label={t('settings.notifications.title')}
        trailing={
          <AppText style={{ color: '#667085', fontSize: 13 }}>
            {t('settings.notifications.webOnly')}
          </AppText>
        }
      />
    )
  }

  return (
    <View style={{ gap: 8 }}>
      <SettingsLabeledRow
        label={t('settings.notifications.title')}
        trailing={
          <AppText style={{ color: '#667085', fontSize: 13, fontWeight: '600' }}>
            {enabled ? t('settings.notifications.enabled') : t('settings.notifications.disabled')}
          </AppText>
        }
      />
      <Pressable
        accessibilityRole="button"
        disabled={isSubmitting}
        onPress={() => void (enabled ? handleDisable() : handleEnable())}
      >
        <AppText style={{ color: '#1a56db', fontSize: 14, fontWeight: '600' }}>
          {isSubmitting
            ? t('settings.notifications.updating')
            : enabled
              ? t('settings.notifications.disable')
              : t('settings.notifications.enable')}
        </AppText>
      </Pressable>
      {permissionStatus === 'denied' ? (
        <AppText style={{ color: '#b54708', fontSize: 13 }}>
          {t('settings.notifications.permissionDenied')}
        </AppText>
      ) : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
    </View>
  )
}
