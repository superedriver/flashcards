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
import { signUpSchema, type SignUpFormValues } from '@/features/auth/validation/sign-up.schema'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { useRegisterMutation } from '@/graphql/generated'
import { AppButton, AppInput, AppText } from '@/ui/primitives'

import { GoogleLoginButton } from './google-login-button'

export function SignUpForm() {
  const router = useRouter()
  const { setError, setLoading, isLoading } = useAuth()
  const [registerMutation] = useRegisterMutation()
  const isSubmittingRef = useRef(false)

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
    if (isSubmittingRef.current || isLoading) {
      return
    }

    isSubmittingRef.current = true
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
      router.replace(getPostAuthRedirectHref(mapSafeUserToAuthUser(payload.user)))
    } catch (submitError) {
      setError(getGraphqlErrorMessage(submitError, 'Sign up failed. Please try again.'))
    } finally {
      isSubmittingRef.current = false
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
            onChangeText={(text) => {
              setError(null)
              onChange(text)
            }}
          />
        )}
      />
      <AuthFieldError message={errors.email?.message} />

      <Controller
        control={control}
        name="password"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
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

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            placeholder="Confirm password"
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

      <AppButton disabled={isLoading} onPress={() => void onSubmit()}>
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </AppButton>

      <GoogleLoginButton />

      <Link href="/(auth)/sign-in">
        <AppText>Already have an account? Sign in</AppText>
      </Link>
    </View>
  )
}
