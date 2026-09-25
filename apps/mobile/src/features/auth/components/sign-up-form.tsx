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
  createSignUpSchema,
  type SignUpFormValues,
} from '@/features/auth/validation/sign-up.schema'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { useRegisterMutation } from '@/graphql/generated'
import { FieldLabel } from '@/ui/components'
import { AppButton, AppInput, AppText } from '@/ui/primitives'

import { AppleLoginButton } from './apple-login-button'
import { GoogleLoginButton } from './google-login-button'

export function SignUpForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const { setError, setLoading, isLoading } = useAuth()
  const [registerMutation] = useRegisterMutation()
  const isSubmittingRef = useRef(false)
  const signUpSchema = useMemo(() => createSignUpSchema(t), [t])

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
            autoComplete="new-password"
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

      <FieldLabel>{t('auth.confirmPassword')}</FieldLabel>
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel={t('auth.confirmPassword')}
            autoComplete="new-password"
            placeholder={t('auth.confirmPassword')}
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
        {isLoading ? t('auth.signUp.submitting') : t('auth.signUp.submit')}
      </AppButton>

      <GoogleLoginButton />
      <AppleLoginButton />

      <Link href="/(auth)/sign-in">
        <AppText>{t('auth.signUp.hasAccount')}</AppText>
      </Link>
    </View>
  )
}
