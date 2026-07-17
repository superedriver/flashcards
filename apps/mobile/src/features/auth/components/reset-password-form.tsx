import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AuthFieldError } from '@/features/auth/components/auth-field-error'
import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/auth/validation/reset-password.schema'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { useResetPasswordMutation } from '@/graphql/generated'
import { ErrorState, FieldLabel, PageTitle, Screen } from '@/ui/components'
import { AppButton, AppInput, AppText } from '@/ui/primitives'

export function ResetPasswordForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const { token } = useLocalSearchParams<{ token?: string }>()
  const [resetPassword, { loading }] = useResetPasswordMutation()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isSubmittingRef = useRef(false)
  const resetPasswordSchema = useMemo(() => createResetPasswordSchema(t), [t])

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      confirmPassword: '',
      newPassword: '',
    },
    resolver: zodResolver(resetPasswordSchema),
  })

  if (!token || typeof token !== 'string') {
    return (
      <View style={{ gap: 12 }}>
        <ErrorState message={t('auth.resetPassword.invalidLink')} />
        <AppButton onPress={() => router.replace('/(auth)/forgot-password')}>
          {t('auth.resetPassword.requestNewLink')}
        </AppButton>
        <AppButton onPress={() => router.replace('/(auth)/sign-in')}>
          {t('auth.resetPassword.backToSignIn')}
        </AppButton>
      </View>
    )
  }

  const onSubmit = handleSubmit(async (values) => {
    if (isSubmittingRef.current || loading) {
      return
    }

    isSubmittingRef.current = true
    setError(null)

    try {
      await resetPassword({
        variables: {
          input: {
            newPassword: values.newPassword,
            token,
          },
        },
      })
      setSuccess(true)
    } catch (submitError) {
      setError(getGraphqlErrorMessage(submitError, t('auth.resetPassword.failed')))
    } finally {
      isSubmittingRef.current = false
    }
  })

  if (success) {
    return (
      <View style={{ gap: 12 }}>
        <AppText>{t('auth.resetPassword.success')}</AppText>
        <AppButton onPress={() => router.replace('/(auth)/sign-in')}>
          {t('auth.resetPassword.goToSignIn')}
        </AppButton>
      </View>
    )
  }

  return (
    <View style={{ gap: 12 }}>
      <FieldLabel>{t('auth.newPassword')}</FieldLabel>
      <Controller
        control={control}
        name="newPassword"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel={t('auth.newPassword')}
            autoComplete="new-password"
            placeholder={t('auth.newPassword')}
            secureTextEntry
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              setError(null)
              onChange(text)
            }}
          />
        )}
      />
      <AuthFieldError message={errors.newPassword?.message} />

      <FieldLabel>{t('auth.confirmNewPassword')}</FieldLabel>
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel={t('auth.confirmNewPassword')}
            autoComplete="new-password"
            placeholder={t('auth.confirmNewPassword')}
            secureTextEntry
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              setError(null)
              onChange(text)
            }}
          />
        )}
      />
      <AuthFieldError message={errors.confirmPassword?.message} />
      {error ? <ErrorState message={error} /> : null}

      <AppButton disabled={loading} onPress={() => void onSubmit()}>
        {loading ? t('auth.resetPassword.submitting') : t('auth.resetPassword.submit')}
      </AppButton>
    </View>
  )
}

export function ResetPasswordScreen() {
  const { t } = useTranslation()

  return (
    <Screen scrollable variant="narrow">
      <PageTitle title={t('auth.resetPassword.title')} />
      <ResetPasswordForm />
    </Screen>
  )
}
