import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { InterfaceLocaleField } from '@/features/settings/components/interface-locale-field'
import { LessonSizeField } from '@/features/settings/components/lesson-size-field'
import { NativeLanguageField } from '@/features/settings/components/native-language-field'
import { ReminderTimeField } from '@/features/settings/components/reminder-time-field'
import { TimezoneField } from '@/features/settings/components/timezone-field'
import {
  createSettingsFormSchema,
  getDeviceTimezone,
  type SettingsFormValues,
} from '@/features/settings/validation/settings-form.schema'
import { getCurrentLocale, setAppLocale } from '@/i18n'
import { persistLocale } from '@/i18n/locale-storage'
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
  const { t } = useTranslation()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isSubmittingRef = useRef(false)
  const settingsFormSchema = useMemo(() => createSettingsFormSchema(t), [t])

  const { data, error, loading, refetch } = useMySettingsQuery()
  const [updateSettings, { loading: isSaving }] = useUpdateMySettingsMutation({
    refetchQueries: ['MySettings', 'StudyLanguageBootstrap'],
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<SettingsFormValues>({
    defaultValues: {
      interfaceLocale: getCurrentLocale(),
      lessonSize: 20,
      nativeLanguage: '',
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
      interfaceLocale: settings.interfaceLocale === 'uk' ? 'uk' : 'en',
      lessonSize: settings.lessonSize,
      nativeLanguage: settings.nativeLanguage,
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
    if (isSubmittingRef.current || isSaving) {
      return
    }

    isSubmittingRef.current = true
    setErrorMessage(null)
    setFeedback(null)

    try {
      const result = await updateSettings({
        variables: {
          input: {
            interfaceLocale: values.interfaceLocale,
            lessonSize: values.lessonSize,
            nativeLanguage: values.nativeLanguage,
            notificationsEnabled: values.notificationsEnabled,
            reminderTime: values.reminderTime ?? undefined,
            timezone: values.timezone,
          },
        },
      })

      if (!result.data?.updateSettings) {
        setErrorMessage(t('settings.saveError'))
        return
      }

      await setAppLocale(values.interfaceLocale)
      await persistLocale(values.interfaceLocale)
      setFeedback(t('settings.saved'))
    } catch (submitError) {
      setErrorMessage(getGraphqlErrorMessage(submitError, t('settings.saveError')))
    } finally {
      isSubmittingRef.current = false
    }
  })

  if (loading) {
    return <LoadingState message={t('settings.loading')} />
  }

  if (error) {
    return <ErrorState message={t('settings.loadError')} onRetry={() => void refetch()} />
  }

  return (
    <View style={{ gap: 12, marginBottom: 16 }}>
      <AppText accessibilityRole="header" style={{ fontSize: 16, fontWeight: '600' }}>
        {t('settings.title')}
      </AppText>
      <AppText style={{ color: '#666666', fontSize: 14 }}>{t('settings.description')}</AppText>
      <InterfaceLocaleField control={control} errors={errors} />
      <NativeLanguageField control={control} errors={errors} />
      <LessonSizeField control={control} errors={errors} />
      <ReminderTimeField control={control} errors={errors} />
      <TimezoneField control={control} errors={errors} />
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      {feedback ? (
        <AppText style={{ color: '#2e7d32', fontWeight: '600' }}>{feedback}</AppText>
      ) : null}
      <AppButton disabled={isSaving} onPress={() => void onSubmit()}>
        {isSaving ? t('settings.saving') : t('settings.save')}
      </AppButton>
    </View>
  )
}
