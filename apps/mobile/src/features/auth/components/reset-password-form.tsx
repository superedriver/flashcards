import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { AuthFieldError } from '@/features/auth/components/auth-field-error'
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/auth/validation/reset-password.schema'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { useResetPasswordMutation } from '@/graphql/generated'
import { AppButton, AppInput, AppText } from '@/ui/primitives'
import { ErrorState, PageTitle, Screen } from '@/ui/components'

export function ResetPasswordForm() {
  const router = useRouter()
  const { token } = useLocalSearchParams<{ token?: string }>()
  const [resetPassword, { loading }] = useResetPasswordMutation()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isSubmittingRef = useRef(false)

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
        <ErrorState message="This reset link is invalid or incomplete." />
        <AppButton onPress={() => router.replace('/(auth)/forgot-password')}>
          Request a new reset link
        </AppButton>
        <AppButton onPress={() => router.replace('/(auth)/sign-in')}>Back to sign in</AppButton>
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
      setError(
        getGraphqlErrorMessage(submitError, 'Password reset failed. The link may have expired.'),
      )
    } finally {
      isSubmittingRef.current = false
    }
  })

  if (success) {
    return (
      <View style={{ gap: 12 }}>
        <AppText>Your password has been reset. You can now sign in with your new password.</AppText>
        <AppButton onPress={() => router.replace('/(auth)/sign-in')}>Go to sign in</AppButton>
      </View>
    )
  }

  return (
    <View style={{ gap: 12 }}>
      <Controller
        control={control}
        name="newPassword"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            placeholder="New password"
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

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            placeholder="Confirm new password"
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
        {loading ? 'Resetting...' : 'Reset password'}
      </AppButton>
    </View>
  )
}

export function ResetPasswordScreen() {
  return (
    <Screen>
      <PageTitle title="Reset Password" />
      <ResetPasswordForm />
    </Screen>
  )
}
