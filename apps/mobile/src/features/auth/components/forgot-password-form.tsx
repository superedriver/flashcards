import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AuthFieldError } from '@/features/auth/components/auth-field-error'
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/validation/forgot-password.schema'
import { useRequestPasswordResetMutation } from '@/graphql/generated'
import { FieldLabel, PageTitle, Screen } from '@/ui/components'
import { AppButton, AppInput, AppText } from '@/ui/primitives'

export function ForgotPasswordForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const [requestPasswordReset, { loading }] = useRequestPasswordResetMutation()
  const [submitted, setSubmitted] = useState(false)
  const isSubmittingRef = useRef(false)
  const forgotPasswordSchema = useMemo(() => createForgotPasswordSchema(t), [t])

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: '' },
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = handleSubmit(async (values) => {
    if (isSubmittingRef.current || loading || submitted) {
      return
    }

    isSubmittingRef.current = true

    try {
      await requestPasswordReset({
        variables: {
          input: { email: values.email },
        },
      })
    } catch {
      // Always show generic success to avoid email enumeration.
    } finally {
      isSubmittingRef.current = false
      setSubmitted(true)
    }
  })

  if (submitted) {
    return (
      <View style={{ gap: 12 }}>
        <AppText>{t('auth.forgotPassword.success')}</AppText>
        <AppButton onPress={() => router.replace('/(auth)/sign-in')}>
          {t('auth.forgotPassword.backToSignIn')}
        </AppButton>
      </View>
    )
  }

  return (
    <View style={{ gap: 12 }}>
      <AppText style={{ color: '#666666' }}>{t('auth.forgotPassword.description')}</AppText>

      <FieldLabel>{t('auth.email')}</FieldLabel>
      <Controller
        control={control}
        name="email"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel={t('auth.email')}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder={t('auth.email')}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      <AuthFieldError message={errors.email?.message} />

      <AppButton disabled={loading} onPress={() => void onSubmit()}>
        {loading ? t('auth.forgotPassword.submitting') : t('auth.forgotPassword.submit')}
      </AppButton>
      <AppButton onPress={() => router.replace('/(auth)/sign-in')}>
        {t('auth.forgotPassword.backToSignIn')}
      </AppButton>
    </View>
  )
}

export function ForgotPasswordScreen() {
  const { t } = useTranslation()

  return (
    <Screen scrollable variant="narrow">
      <PageTitle title={t('auth.forgotPassword.title')} />
      <ForgotPasswordForm />
    </Screen>
  )
}
