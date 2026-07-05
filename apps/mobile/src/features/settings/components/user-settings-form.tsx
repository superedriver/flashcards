import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { LessonSizeField } from '@/features/settings/components/lesson-size-field'
import { ReminderTimeField } from '@/features/settings/components/reminder-time-field'
import { TimezoneField } from '@/features/settings/components/timezone-field'
import {
  getDeviceTimezone,
  settingsFormSchema,
  type SettingsFormValues,
} from '@/features/settings/validation/settings-form.schema'
import { useMySettingsQuery, useUpdateMySettingsMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, LoadingState } from '@/ui/components'

type UserSettingsFormProps = {
  notificationsEnabled: boolean
  onNotificationsEnabledChange: (value: boolean) => void
}

export function UserSettingsForm({
  notificationsEnabled,
  onNotificationsEnabledChange,
}: UserSettingsFormProps) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data, error, loading, refetch } = useMySettingsQuery()
  const [updateSettings, { loading: isSaving }] = useUpdateMySettingsMutation({
    refetchQueries: ['MySettings'],
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<SettingsFormValues>({
    defaultValues: {
      lessonSize: 20,
      notificationsEnabled: false,
      reminderTime: '09:00',
      timezone: getDeviceTimezone(),
    },
    resolver: zodResolver(settingsFormSchema),
  })

  useEffect(() => {
    const settings = data?.myAccount.settings

    if (!settings) {
      return
    }

    reset({
      lessonSize: settings.lessonSize,
      notificationsEnabled: settings.notificationsEnabled,
      reminderTime: settings.reminderTime,
      timezone: settings.timezone || getDeviceTimezone(),
    })
    onNotificationsEnabledChange(settings.notificationsEnabled)
  }, [data?.myAccount.settings, onNotificationsEnabledChange, reset])

  useEffect(() => {
    reset((current) => ({
      ...current,
      notificationsEnabled,
    }))
  }, [notificationsEnabled, reset])

  const onSubmit = handleSubmit(async (values) => {
    setErrorMessage(null)
    setFeedback(null)

    try {
      const result = await updateSettings({
        variables: {
          input: {
            lessonSize: values.lessonSize,
            notificationsEnabled: values.notificationsEnabled,
            reminderTime: values.reminderTime ?? undefined,
            timezone: values.timezone,
          },
        },
      })

      if (!result.data?.updateSettings) {
        setErrorMessage('Could not save settings.')
        return
      }

      setFeedback('Settings saved.')
    } catch (submitError) {
      setErrorMessage(getGraphqlErrorMessage(submitError, 'Could not save settings.'))
    }
  })

  if (loading) {
    return <LoadingState message="Loading settings..." />
  }

  if (error) {
    return <ErrorState message="Could not load settings." onRetry={() => void refetch()} />
  }

  return (
    <View style={{ gap: 12, marginBottom: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>Settings</AppText>
      <LessonSizeField control={control} errors={errors} />
      <ReminderTimeField control={control} errors={errors} />
      <TimezoneField control={control} errors={errors} />
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      {feedback ? <AppText>{feedback}</AppText> : null}
      <AppButton disabled={isSaving} onPress={() => void onSubmit()}>
        Save Settings
      </AppButton>
    </View>
  )
}
