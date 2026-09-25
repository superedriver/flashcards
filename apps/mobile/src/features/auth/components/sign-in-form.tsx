import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

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
import { AppButton, AppInput, AppText } from '@/ui/primitives'

import { AppleLoginButton } from './apple-login-button'
import { GoogleLoginButton } from './google-login-button'

export function SignInForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const { setError, setLoading, isLoading, error } = useAuth()
  const [loginMutation] = useLoginMutation()
  const isSubmittingRef = useRef(false)
  const signInSchema = useMemo(() => createSignInSchema(t), [t])
  const [showPassword, setShowPassword] = useState(false)

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
    <View style={{ gap: 24 }}>
      {/* Header */}
      <View style={{ alignItems: 'center', gap: 6 }}>
        <AppText style={{ fontSize: 28, fontWeight: '700', letterSpacing: -0.5 }}>
          {t('auth.signIn.welcomeBack')}
        </AppText>
        <AppText style={{ color: '#667085', fontSize: 15 }}>{t('auth.signIn.subtitle')}</AppText>
      </View>

      {/* Fields */}
      <View style={{ gap: 16 }}>
        {/* Email */}
        <View style={{ gap: 6 }}>
          <AppText style={{ fontSize: 14, fontWeight: '500' }}>{t('auth.email')}</AppText>
          <Controller
            control={control}
            name="email"
            render={({ field: { onBlur, onChange, value } }) => (
              <AppInput
                accessibilityLabel={t('auth.email')}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                placeholder="you@example.com"
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
        </View>

        {/* Password */}
        <View style={{ gap: 6 }}>
          <View
            style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <AppText style={{ fontSize: 14, fontWeight: '500' }}>{t('auth.password')}</AppText>
            <Link href="/(auth)/forgot-password">
              <AppText style={{ color: '#2563eb', fontSize: 13 }}>
                {t('auth.signIn.forgotPassword')}
              </AppText>
            </Link>
          </View>
          <View style={{ position: 'relative' }}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onBlur, onChange, value } }) => (
                <AppInput
                  accessibilityLabel={t('auth.password')}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    setError(null)
                    onChange(text)
                  }}
                />
              )}
            />
            <Pressable
              accessibilityLabel={
                showPassword ? t('auth.signIn.hidePassword') : t('auth.signIn.showPassword')
              }
              style={{
                bottom: 0,
                justifyContent: 'center',
                paddingHorizontal: 12,
                position: 'absolute',
                right: 0,
                top: 0,
              }}
              onPress={() => setShowPassword((v) => !v)}
            >
              <AppText style={{ fontSize: 16 }}>{showPassword ? '🙈' : '👁'}</AppText>
            </Pressable>
          </View>
          <AuthFieldError message={errors.password?.message} />
        </View>
      </View>

      {/* Submit error */}
      {error ? (
        <AppText style={{ color: '#b00020', fontSize: 14, textAlign: 'center' }}>{error}</AppText>
      ) : null}

      {/* Primary action */}
      <AppButton
        backgroundColor="#2563eb"
        color="#ffffff"
        disabled={isLoading}
        opacity={isLoading ? 0.6 : 1}
        onPress={() => void onSubmit()}
      >
        {isLoading ? t('auth.signIn.submitting') : t('auth.signIn.submit')}
      </AppButton>

      {/* OAuth */}
      <GoogleLoginButton />
      <AppleLoginButton />

      {/* Footer link */}
      <View
        style={{ alignItems: 'center', flexDirection: 'row', gap: 4, justifyContent: 'center' }}
      >
        <AppText style={{ color: '#667085', fontSize: 14 }}>{t('auth.signIn.newHere')}</AppText>
        <Link href="/(auth)/sign-up">
          <AppText style={{ color: '#2563eb', fontSize: 14, fontWeight: '500' }}>
            {t('auth.signIn.createAccount')}
          </AppText>
        </Link>
      </View>
    </View>
  )
}
