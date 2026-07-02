import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/validation/forgot-password.schema'
import { useRequestPasswordResetMutation } from '@/graphql/generated'
import { AppButton, AppInput, AppText } from '@/ui/primitives'
import { ErrorState, PageTitle, Screen } from '@/ui/components'

export function ForgotPasswordForm() {
  const router = useRouter()
  const [requestPasswordReset, { loading }] = useRequestPasswordResetMutation()
  const [submitted, setSubmitted] = useState(false)

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: '' },
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await requestPasswordReset({
        variables: {
          input: { email: values.email },
        },
      })
    } catch {
      // Always show generic success to avoid email enumeration.
    } finally {
      setSubmitted(true)
    }
  })

  if (submitted) {
    return (
      <AppText>
        If an account exists for that email, password reset instructions have been sent.
      </AppText>
    )
  }

  return (
    <View style={{ gap: 12 }}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors.email ? <ErrorState message={errors.email.message} /> : null}

      <AppButton disabled={loading} onPress={() => void onSubmit()}>
        Send reset link
      </AppButton>
      <AppButton onPress={() => router.replace('/(auth)/sign-in')}>Back to sign in</AppButton>
    </View>
  )
}

export function ForgotPasswordScreen() {
  return (
    <Screen>
      <PageTitle title="Forgot Password" />
      <ForgotPasswordForm />
    </Screen>
  )
}
