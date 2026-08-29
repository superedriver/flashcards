import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { InterfaceLocaleField } from '@/features/settings/components/interface-locale-field'
import { LessonSizeField } from '@/features/settings/components/lesson-size-field'
import { NativeLanguageField } from '@/features/settings/components/native-language-field'
import { ReminderTimeField } from '@/features/settings/components/reminder-time-field'
import { SettingsSectionCard } from '@/features/settings/components/settings-section-card'
import { TimezoneField } from '@/features/settings/components/timezone-field'
import {
  createSettingsFormSchema,
  getDeviceTimezone,
  type SettingsFormValues,
} from '@/features/settings/validation/settings-form.schema'
import type { UpdateSettingsInput } from '@/graphql/generated'
import { useMySettingsQuery, useUpdateMySettingsMutation } from '@/graphql/generated'
import { getCurrentLocale, setAppLocale } from '@/i18n'
import { persistLocale } from '@/i18n/locale-storage'
import { AppText } from '@/ui/primitives'
import { ErrorState, LoadingState } from '@/ui/components'

type UserSettingsFormProps = {
  notificationsSlot?: ReactNode
}

export function UserSettingsForm({ notificationsSlot }: UserSettingsFormProps) {
  const { t } = useTranslation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isSubmittingRef = useRef(false)
  const settingsFormSchema = useMemo(() => createSettingsFormSchema(t), [t])

  const { data, error, loading, refetch } = useMySettingsQuery()
  const [updateSettings] = useUpdateMySettingsMutation({
    refetchQueries: ['MySettings', 'StudyLanguageBootstrap'],
  })
  const pendingInputRef = useRef<UpdateSettingsInput>({})

  const {
    control,
    formState: { errors },
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
  }, [data?.myAccount.settings, reset])

  const flush = async () => {
    if (isSubmittingRef.current) {
      return
    }

    const input = pendingInputRef.current
    pendingInputRef.current = {}

    if (Object.keys(input).length === 0) {
      return
    }

    isSubmittingRef.current = true
    setErrorMessage(null)

    try {
      const result = await updateSettings({
        variables: { input },
      })

      if (!result.data?.updateSettings) {
        setErrorMessage(t('settings.saveError'))
        return
      }

      if (input.interfaceLocale) {
        await setAppLocale(input.interfaceLocale === 'uk' ? 'uk' : 'en')
        await persistLocale(input.interfaceLocale === 'uk' ? 'uk' : 'en')
      }
    } catch (submitError) {
      setErrorMessage(getGraphqlErrorMessage(submitError, t('settings.saveError')))
    } finally {
      isSubmittingRef.current = false

      if (Object.keys(pendingInputRef.current).length > 0) {
        void flush()
      }
    }
  }

  const commit = (input: UpdateSettingsInput) => {
    pendingInputRef.current = { ...pendingInputRef.current, ...input }
    void flush()
  }

  if (loading) {
    return <LoadingState message={t('settings.loading')} />
  }

  if (error) {
    return <ErrorState message={t('settings.loadError')} onRetry={() => void refetch()} />
  }

  return (
    <View style={{ gap: 16 }}>
      <View style={{ gap: 8 }}>
        <AppText accessibilityRole="header" style={{ fontSize: 18, fontWeight: '700' }}>
          {t('settings.preferences')}
        </AppText>
        <SettingsSectionCard>
          <InterfaceLocaleField
            control={control}
            errors={errors}
            onCommit={(value) => void commit({ interfaceLocale: value })}
          />
          <NativeLanguageField
            control={control}
            errors={errors}
            onCommit={(value) => void commit({ nativeLanguage: value })}
          />
          <LessonSizeField
            control={control}
            errors={errors}
            onCommit={(value) => void commit({ lessonSize: value })}
          />
        </SettingsSectionCard>
      </View>

      <View style={{ gap: 8 }}>
        <AppText accessibilityRole="header" style={{ fontSize: 18, fontWeight: '700' }}>
          {t('settings.reminders')}
        </AppText>
        <SettingsSectionCard>
          <ReminderTimeField
            control={control}
            errors={errors}
            onCommit={(value) => void commit({ reminderTime: value })}
          />
          <TimezoneField
            control={control}
            errors={errors}
            onCommit={(value) => void commit({ timezone: value })}
          />
          {notificationsSlot}
        </SettingsSectionCard>
      </View>

      {errorMessage ? <ErrorState message={errorMessage} /> : null}
    </View>
  )
}
