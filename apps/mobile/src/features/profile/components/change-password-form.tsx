import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { AuthFieldError } from '@/features/auth/components/auth-field-error'
import { PasswordMatchIndicator } from '@/features/auth/components/password-match-indicator'
import {
  PasswordStrengthChecklist,
  passwordMeetsAllRules,
} from '@/features/auth/components/password-strength-checklist'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import {
  createChangePasswordSchema,
  type ChangePasswordFormValues,
} from '@/features/profile/validation/change-password.schema'
import { useChangePasswordMutation } from '@/graphql/generated'
import { AppButton, AppInput, AppText } from '@/ui/primitives'

export function ChangePasswordForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const [changePasswordMutation, { loading }] = useChangePasswordMutation()
  const isSubmittingRef = useRef(false)
  const schema = useMemo(() => createChangePasswordSchema(t), [t])

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [newPasswordFocused, setNewPasswordFocused] = useState(false)
  const [newPasswordValue, setNewPasswordValue] = useState('')
  const [confirmValue, setConfirmValue] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => router.back(), 2000)
    return () => clearTimeout(timer)
  }, [success, router])

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      confirmNewPassword: '',
      currentPassword: '',
      newPassword: '',
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = handleSubmit(async (values) => {
    if (isSubmittingRef.current || loading) {
      return
    }

    isSubmittingRef.current = true
    setSubmitError(null)

    try {
      const result = await changePasswordMutation({
        variables: {
          input: {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          },
        },
      })

      if (result.data?.changePassword) {
        setSuccess(true)
      } else {
        setSubmitError(t('profile.changePassword.wrongCurrentPassword'))
      }
    } catch (err) {
      setSubmitError(
        getGraphqlErrorMessage(err, t('profile.changePassword.wrongCurrentPassword'), t, {
          INVALID_CREDENTIALS: 'profile.changePassword.wrongCurrentPassword',
          UNAUTHORIZED: 'profile.changePassword.wrongCurrentPassword',
          VALIDATION_ERROR: 'profile.changePassword.wrongCurrentPassword',
        }),
      )
    } finally {
      isSubmittingRef.current = false
    }
  })

  const showChecklist = newPasswordFocused || newPasswordValue.length > 0
  const allRulesMet = passwordMeetsAllRules(newPasswordValue)
  const passwordsMatch = newPasswordValue === confirmValue && confirmValue.length > 0

  if (success) {
    return (
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', padding: 24 }}>
        <AppText style={{ color: '#16a34a', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
          {t('profile.changePassword.success')}
        </AppText>
      </View>
    )
  }

  return (
    <View style={{ gap: 24 }}>
      <View style={{ gap: 16 }}>
        {/* Current password */}
        <View style={{ gap: 6 }}>
          <AppText style={{ fontSize: 14, fontWeight: '500' }}>
            {t('profile.changePassword.currentPassword')}
          </AppText>
          <View style={{ position: 'relative' }}>
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onBlur, onChange, value } }) => (
                <AppInput
                  accessibilityLabel={t('profile.changePassword.currentPassword')}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  secureTextEntry={!showCurrentPassword}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    setSubmitError(null)
                    onChange(text)
                  }}
                />
              )}
            />
            <Pressable
              accessibilityLabel={
                showCurrentPassword
                  ? t('profile.changePassword.hidePassword')
                  : t('profile.changePassword.showPassword')
              }
              style={{
                bottom: 0,
                justifyContent: 'center',
                paddingHorizontal: 12,
                position: 'absolute',
                right: 0,
                top: 0,
              }}
              onPress={() => setShowCurrentPassword((v) => !v)}
            >
              <AppText style={{ fontSize: 16 }}>{showCurrentPassword ? '🙈' : '👁'}</AppText>
            </Pressable>
          </View>
          <AuthFieldError message={errors.currentPassword?.message} />
        </View>

        {/* New password */}
        <View style={{ gap: 6 }}>
          <AppText style={{ fontSize: 14, fontWeight: '500' }}>
            {t('profile.changePassword.newPassword')}
          </AppText>
          <View style={{ position: 'relative' }}>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onBlur, onChange, value } }) => (
                <AppInput
                  accessibilityLabel={t('profile.changePassword.newPassword')}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  secureTextEntry={!showNewPassword}
                  value={value}
                  onBlur={() => {
                    setNewPasswordFocused(false)
                    onBlur()
                  }}
                  onChangeText={(text) => {
                    setSubmitError(null)
                    setNewPasswordValue(text)
                    onChange(text)
                  }}
                  onFocus={() => setNewPasswordFocused(true)}
                />
              )}
            />
            <Pressable
              accessibilityLabel={
                showNewPassword
                  ? t('profile.changePassword.hidePassword')
                  : t('profile.changePassword.showPassword')
              }
              style={{
                bottom: 0,
                justifyContent: 'center',
                paddingHorizontal: 12,
                position: 'absolute',
                right: 0,
                top: 0,
              }}
              onPress={() => setShowNewPassword((v) => !v)}
            >
              <AppText style={{ fontSize: 16 }}>{showNewPassword ? '🙈' : '👁'}</AppText>
            </Pressable>
          </View>
          {showChecklist ? <PasswordStrengthChecklist password={newPasswordValue} /> : null}
          <AuthFieldError message={errors.newPassword?.message} />
        </View>

        {/* Confirm new password */}
        <View style={{ gap: 6 }}>
          <AppText style={{ fontSize: 14, fontWeight: '500' }}>
            {t('profile.changePassword.confirmNewPassword')}
          </AppText>
          <View style={{ position: 'relative' }}>
            <Controller
              control={control}
              name="confirmNewPassword"
              render={({ field: { onBlur, onChange, value } }) => (
                <AppInput
                  accessibilityLabel={t('profile.changePassword.confirmNewPassword')}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  secureTextEntry={!showConfirm}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    setSubmitError(null)
                    setConfirmValue(text)
                    onChange(text)
                  }}
                />
              )}
            />
            <Pressable
              accessibilityLabel={
                showConfirm
                  ? t('profile.changePassword.hidePassword')
                  : t('profile.changePassword.showPassword')
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
          {confirmValue.length > 0 ? (
            <PasswordMatchIndicator confirmPassword={confirmValue} password={newPasswordValue} />
          ) : null}
          <AuthFieldError message={errors.confirmNewPassword?.message} />
        </View>
      </View>

      {submitError ? (
        <AppText style={{ color: '#b00020', fontSize: 14, textAlign: 'center' }}>
          {submitError}
        </AppText>
      ) : null}

      <AppButton
        style={{
          backgroundColor: '#2563eb',
          opacity: loading || !allRulesMet || !passwordsMatch ? 0.6 : 1,
        }}
        color="#ffffff"
        disabled={loading || !allRulesMet || !passwordsMatch}
        onPress={() => void onSubmit()}
      >
        {loading ? t('profile.changePassword.submitting') : t('profile.changePassword.submit')}
      </AppButton>
    </View>
  )
}
