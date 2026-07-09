import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import {
  createInviteUserSchema,
  type InviteUserValues,
} from '@/features/groups/validation/invite-user.schema'
import { useInviteUserToGroupMutation } from '@/graphql/generated'
import { AppButton, AppInput, AppText } from '@/ui/primitives'
import { ErrorState, FormFieldError } from '@/ui/components'

type InviteUserFormProps = {
  groupId: string
  onSuccess?: () => void
}

export function InviteUserForm({ groupId, onSuccess }: InviteUserFormProps) {
  const { t } = useTranslation()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isSubmittingRef = useRef(false)
  const [inviteUser, { loading }] = useInviteUserToGroupMutation()
  const inviteUserSchema = useMemo(() => createInviteUserSchema(t), [t])

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<InviteUserValues>({
    defaultValues: { email: '' },
    resolver: zodResolver(inviteUserSchema),
  })

  const onSubmit = handleSubmit(async (values) => {
    if (isSubmittingRef.current || loading) {
      return
    }

    isSubmittingRef.current = true
    setErrorMessage(null)
    setFeedback(null)

    try {
      const result = await inviteUser({
        variables: {
          input: {
            groupId,
            email: values.email.trim(),
          },
        },
      })

      if (!result.data?.inviteUserToGroup) {
        setErrorMessage(t('groups.inviteUser.error'))
        return
      }

      reset({ email: '' })
      setFeedback(t('groups.inviteUser.success'))
      onSuccess?.()
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, t('groups.inviteUser.error')))
    } finally {
      isSubmittingRef.current = false
    }
  })

  return (
    <View style={{ gap: 12, marginBottom: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>{t('groups.inviteUser.title')}</AppText>
      <AppText style={{ color: '#666666', fontSize: 14 }}>{t('groups.inviteUser.hint')}</AppText>
      <Controller
        control={control}
        name="email"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder={t('groups.inviteUser.emailPlaceholder')}
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              setErrorMessage(null)
              onChange(text)
            }}
          />
        )}
      />
      <FormFieldError message={errors.email?.message} />
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      {feedback ? (
        <AppText style={{ color: '#2e7d32', fontWeight: '600' }}>{feedback}</AppText>
      ) : null}
      <AppButton disabled={loading} onPress={() => void onSubmit()}>
        {loading ? t('groups.inviteUser.sending') : t('groups.inviteUser.submit')}
      </AppButton>
    </View>
  )
}
