import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import {
  inviteUserSchema,
  type InviteUserValues,
} from '@/features/groups/validation/invite-user.schema'
import { useInviteUserToGroupMutation } from '@/graphql/generated'
import { AppButton, AppInput, AppText } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

type InviteUserFormProps = {
  groupId: string
  onSuccess?: () => void
}

export function InviteUserForm({ groupId, onSuccess }: InviteUserFormProps) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [inviteUser, { loading }] = useInviteUserToGroupMutation()

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
        setErrorMessage('Could not send invitation.')
        return
      }

      reset({ email: '' })
      setFeedback('Invitation sent. The user can accept it from their invitations screen.')
      onSuccess?.()
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, 'Could not send invitation.'))
    }
  })

  return (
    <View style={{ gap: 12, marginBottom: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>Invite by email</AppText>
      <Controller
        control={control}
        name="email"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email address"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors.email ? <ErrorState message={errors.email.message} /> : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      {feedback ? <AppText>{feedback}</AppText> : null}
      <AppButton disabled={loading} onPress={() => void onSubmit()}>
        Send Invitation
      </AppButton>
    </View>
  )
}
