import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { GroupForm } from '@/features/groups/components/group-form'
import { getGraphqlErrorMessage, optionalText } from '@/features/decks/utils/deck-form-utils'
import type { GroupFormValues } from '@/features/groups/validation/group-form.schema'
import { useCreateGroupMutation } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { PageTitle, Screen } from '@/ui/components'

export function CreateGroupScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isSubmittingRef = useRef(false)
  const [createGroup, { loading }] = useCreateGroupMutation({
    refetchQueries: ['MyGroups'],
  })

  const handleSubmit = async (values: GroupFormValues) => {
    if (isSubmittingRef.current || loading) {
      return
    }

    isSubmittingRef.current = true
    setErrorMessage(null)

    try {
      const result = await createGroup({
        variables: {
          input: {
            name: values.name.trim(),
            description: optionalText(values.description),
          },
        },
      })

      const group = result.data?.createGroup

      if (!group) {
        setErrorMessage(t('groups.createGroup.error'))
        return
      }

      router.replace(`/groups/${group.id}`)
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, t('groups.createGroup.error')))
    } finally {
      isSubmittingRef.current = false
    }
  }

  return (
    <Screen scrollable>
      <View style={{ maxWidth: 560, width: '100%' }}>
        <PageTitle title={t('groups.createGroup.title')} />
        <AppText style={{ color: '#667085', marginBottom: 16 }}>
          {t('groups.createGroup.subtitle')}
        </AppText>
        <GroupForm
          errorMessage={errorMessage}
          isSubmitting={loading}
          submitLabel={t('groups.createGroup.submit')}
          submittingLabel={t('groups.createGroup.submitting')}
          onCancel={() => router.back()}
          onClearError={() => setErrorMessage(null)}
          onSubmit={handleSubmit}
        />
      </View>
    </Screen>
  )
}
