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
  createSignUpSchema,
  type SignUpFormValues,
} from '@/features/auth/validation/sign-up.schema'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { useRegisterMutation } from '@/graphql/generated'
import { AppButton, AppInput, AppText } from '@/ui/primitives'

import { OAuthButtons } from './oauth-buttons'
import { OrDivider } from './or-divider'

export function SignUpForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const { setError, setLoading, isLoading, error } = useAuth()
  const [registerMutation] = useRegisterMutation()
  const isSubmittingRef = useRef(false)
  const signUpSchema = useMemo(() => createSignUpSchema(t), [t])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

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
        setError(t('auth.signUp.failed'))
        return
      }

      await applyAuthPayload(payload)
      router.replace(getPostAuthRedirectHref(mapSafeUserToAuthUser(payload.user)))
    } catch (submitError) {
      setError(getGraphqlErrorMessage(submitError, t('auth.signUp.failed')))
    } finally {
      isSubmittingRef.current = false
      setLoading(false)
    }
  })

  const showPasswordHint = (passwordFocused || Boolean(errors.password)) && !errors.password

  return (
    <View style={{ gap: 24 }}>
      {/* Header */}
      <View style={{ alignItems: 'center', gap: 6 }}>
        <AppText style={{ fontSize: 28, fontWeight: '700', letterSpacing: -0.5 }}>
          {t('auth.signUp.welcomeTitle')}
        </AppText>
        <AppText style={{ color: '#667085', fontSize: 15 }}>{t('auth.signUp.subtitle')}</AppText>
      </View>

      {/* OAuth */}
      <OAuthButtons />

      {/* Divider */}
      <OrDivider />

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
          <AppText style={{ fontSize: 14, fontWeight: '500' }}>{t('auth.password')}</AppText>
          <View style={{ position: 'relative' }}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onBlur, onChange, value } }) => (
                <AppInput
                  accessibilityLabel={t('auth.password')}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  value={value}
                  onBlur={() => {
                    setPasswordFocused(false)
                    onBlur()
                  }}
                  onChangeText={(text) => {
                    setError(null)
                    onChange(text)
                  }}
                  onFocus={() => setPasswordFocused(true)}
                />
              )}
            />
            <Pressable
              accessibilityLabel={
                showPassword ? t('auth.signUp.hidePassword') : t('auth.signUp.showPassword')
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
          {showPasswordHint ? (
            <AppText style={{ color: '#667085', fontSize: 12 }}>
              {t('auth.validation.passwordMin')}
            </AppText>
          ) : null}
          <AuthFieldError message={errors.password?.message} />
        </View>

        {/* Confirm password */}
        <View style={{ gap: 6 }}>
          <AppText style={{ fontSize: 14, fontWeight: '500' }}>{t('auth.confirmPassword')}</AppText>
          <View style={{ position: 'relative' }}>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onBlur, onChange, value } }) => (
                <AppInput
                  accessibilityLabel={t('auth.confirmPassword')}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  secureTextEntry={!showConfirm}
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
                showConfirm
                  ? t('auth.signUp.hideConfirmPassword')
                  : t('auth.signUp.showConfirmPassword')
              }
              style={{
                bottom: 0,
                justifyContent: 'center',
                paddingHorizontal: 12,
                position: 'absolute',
                right: 0,
                top: 0,
              }}
              onPress={() => setShowConfirm((v) => !v)}
            >
              <AppText style={{ fontSize: 16 }}>{showConfirm ? '🙈' : '👁'}</AppText>
            </Pressable>
          </View>
          <AuthFieldError message={errors.confirmPassword?.message} />
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
        {isLoading ? t('auth.signUp.submitting') : t('auth.signUp.submit')}
      </AppButton>

      {/* Footer link */}
      <View
        style={{ alignItems: 'center', flexDirection: 'row', gap: 4, justifyContent: 'center' }}
      >
        <AppText style={{ color: '#667085', fontSize: 14 }}>{t('auth.signUp.hasAccount')}</AppText>
        <Link href="/(auth)/sign-in">
          <AppText style={{ color: '#2563eb', fontSize: 14, fontWeight: '500' }}>
            {t('auth.signUp.signIn')}
          </AppText>
        </Link>
      </View>
    </View>
  )
}
