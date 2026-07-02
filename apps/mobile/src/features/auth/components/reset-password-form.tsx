import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/auth/validation/reset-password.schema'
import { useResetPasswordMutation } from '@/graphql/generated'
import { AppButton, AppInput, AppText } from '@/ui/primitives'
import { ErrorState, PageTitle, Screen } from '@/ui/components'

export function ResetPasswordForm() {
  const router = useRouter()
  const { token } = useLocalSearchParams<{ token?: string }>()
  const [resetPassword, { loading }] = useResetPasswordMutation()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const onSubmit = handleSubmit(async (values) => {
    if (!token || typeof token !== 'string') {
      setError('Reset token is missing.')
      return
    }

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
    } catch {
      setError('Password reset failed. The link may have expired.')
    }
  })

  if (success) {
    return (
      <View style={{ gap: 12 }}>
        <AppText>Your password has been reset.</AppText>
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
            onChangeText={onChange}
          />
        )}
      />
      {errors.newPassword ? <ErrorState message={errors.newPassword.message} /> : null}

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            placeholder="Confirm new password"
            secureTextEntry
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors.confirmPassword ? <ErrorState message={errors.confirmPassword.message} /> : null}
      {error ? <ErrorState message={error} /> : null}

      <AppButton disabled={loading} onPress={() => void onSubmit()}>
        Reset password
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
