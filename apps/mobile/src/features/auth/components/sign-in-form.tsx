import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { applyAuthPayload } from '@/features/auth/services/auth-session'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { signInSchema, type SignInFormValues } from '@/features/auth/validation/sign-in.schema'
import { useLoginMutation } from '@/graphql/generated'
import { AppButton, AppInput, AppText } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

export function SignInForm() {
  const router = useRouter()
  const { setError, setLoading, isLoading } = useAuth()
  const [loginMutation] = useLoginMutation()

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true)
    setError(null)

    try {
      const result = await loginMutation({
        variables: {
          input: {
            email: values.email,
            password: values.password,
          },
        },
      })

      const payload = result.data?.login

      if (!payload) {
        setError('Sign in failed. Check your credentials and try again.')
        return
      }

      await applyAuthPayload(payload)
      router.replace('/(tabs)')
    } catch {
      setError('Sign in failed. Check your credentials and try again.')
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

      <AppButton disabled={isLoading} onPress={() => void onSubmit()}>
        Sign In
      </AppButton>

      <View style={{ gap: 8, marginTop: 8 }}>
        <Link href="/(auth)/sign-up">
          <AppText>Create an account</AppText>
        </Link>
        <Link href="/(auth)/forgot-password">
          <AppText>Forgot password?</AppText>
        </Link>
      </View>
    </View>
  )
}
