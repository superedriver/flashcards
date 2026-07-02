import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { applyAuthPayload } from '@/features/auth/services/auth-session'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { signUpSchema, type SignUpFormValues } from '@/features/auth/validation/sign-up.schema'
import { useRegisterMutation } from '@/graphql/generated'
import { AppButton, AppInput, AppText } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

import { GoogleLoginButton } from './google-login-button'

export function SignUpForm() {
  const router = useRouter()
  const { setError, setLoading, isLoading } = useAuth()
  const [registerMutation] = useRegisterMutation()

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<SignUpFormValues>({
    defaultValues: {
      confirmPassword: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true)
    setError(null)

    try {
      const result = await registerMutation({
        variables: {
          input: {
            email: values.email,
            password: values.password,
          },
        },
      })

      const payload = result.data?.register

      if (!payload) {
        setError('Sign up failed. Please try again.')
        return
      }

      await applyAuthPayload(payload)
      router.replace('/(auth)/verify-email-prompt')
    } catch {
      setError('Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  })

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

      <Controller
        control={control}
        name="password"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            placeholder="Password"
            secureTextEntry
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password ? <ErrorState message={errors.password.message} /> : null}

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            placeholder="Confirm password"
            secureTextEntry
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors.confirmPassword ? <ErrorState message={errors.confirmPassword.message} /> : null}

      <AppButton disabled={isLoading} onPress={() => void onSubmit()}>
        Sign Up
      </AppButton>

      <GoogleLoginButton />

      <Link href="/(auth)/sign-in">
        <AppText>Already have an account? Sign in</AppText>
      </Link>
    </View>
  )
}
