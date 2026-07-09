import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { useMemo, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AuthFieldError } from '@/features/auth/components/auth-field-error'
import { applyAuthPayload } from '@/features/auth/services/auth-session'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { mapSafeUserToAuthUser } from '@/features/auth/state/auth-store'
import { getPostAuthRedirectHref } from '@/features/auth/utils/get-post-auth-redirect'
import {
  createSignInSchema,
  type SignInFormValues,
} from '@/features/auth/validation/sign-in.schema'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { useLoginMutation } from '@/graphql/generated'
import { FieldLabel } from '@/ui/components'
import { AppButton, AppInput, AppText } from '@/ui/primitives'

import { GoogleLoginButton } from './google-login-button'

export function SignInForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const { setError, setLoading, isLoading } = useAuth()
  const [loginMutation] = useLoginMutation()
  const isSubmittingRef = useRef(false)
  const signInSchema = useMemo(() => createSignInSchema(t), [t])

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
        setError(t('auth.signIn.failed'))
        return
      }

      await applyAuthPayload(payload)
      router.replace(getPostAuthRedirectHref(mapSafeUserToAuthUser(payload.user)))
    } catch (submitError) {
      setError(getGraphqlErrorMessage(submitError, t('auth.signIn.failed')))
    } finally {
      isSubmittingRef.current = false
      setLoading(false)
    }
  })

  return (
    <View style={{ gap: 12 }}>
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
            onChangeText={(text) => {
              setError(null)
              onChange(text)
            }}
          />
        )}
      />
      <AuthFieldError message={errors.email?.message} />

      <FieldLabel>{t('auth.password')}</FieldLabel>
      <Controller
        control={control}
        name="password"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel={t('auth.password')}
            autoComplete="current-password"
            placeholder={t('auth.password')}
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
        {isLoading ? t('auth.signIn.submitting') : t('auth.signIn.submit')}
      </AppButton>

      <GoogleLoginButton />

      <View style={{ gap: 8, marginTop: 8 }}>
        <Link href="/(auth)/sign-up">
          <AppText>{t('auth.signIn.createAccount')}</AppText>
        </Link>
        <Link href="/(auth)/forgot-password">
          <AppText>{t('auth.signIn.forgotPassword')}</AppText>
        </Link>
      </View>
    </View>
  )
}
