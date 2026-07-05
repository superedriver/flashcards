import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { AuthFieldError } from '@/features/auth/components/auth-field-error'
import { applyAuthPayload } from '@/features/auth/services/auth-session'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { mapSafeUserToAuthUser } from '@/features/auth/state/auth-store'
import { getPostAuthRedirectHref } from '@/features/auth/utils/get-post-auth-redirect'
import { signInSchema, type SignInFormValues } from '@/features/auth/validation/sign-in.schema'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { useLoginMutation } from '@/graphql/generated'
import { FieldLabel } from '@/ui/components'
import { AppButton, AppInput, AppText } from '@/ui/primitives'

import { GoogleLoginButton } from './google-login-button'

export function SignInForm() {
  const router = useRouter()
  const { setError, setLoading, isLoading } = useAuth()
  const [loginMutation] = useLoginMutation()
  const isSubmittingRef = useRef(false)

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
    if (isSubmittingRef.current || isLoading) {
      return
    }

    isSubmittingRef.current = true
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
        setError('Sign in failed. Check your email and password.')
        return
      }

      await applyAuthPayload(payload)
      router.replace(getPostAuthRedirectHref(mapSafeUserToAuthUser(payload.user)))
    } catch (submitError) {
      setError(
        getGraphqlErrorMessage(submitError, 'Sign in failed. Check your email and password.'),
      )
    } finally {
      isSubmittingRef.current = false
      setLoading(false)
    }
  })

  return (
    <View style={{ gap: 12 }}>
      <FieldLabel>Email</FieldLabel>
      <Controller
        control={control}
        name="email"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="Email"
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              setError(null)
              onChange(text)
            }}
          />
        )}
      />
      <AuthFieldError message={errors.email?.message} />

      <FieldLabel>Password</FieldLabel>
      <Controller
        control={control}
        name="password"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel="Password"
            autoComplete="current-password"
            placeholder="Password"
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
      <AuthFieldError message={errors.password?.message} />

      <AppButton disabled={isLoading} onPress={() => void onSubmit()}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </AppButton>

      <GoogleLoginButton />

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
