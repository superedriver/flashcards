import { useRouter } from 'expo-router'
import { useState } from 'react'

import { GroupForm } from '@/features/groups/components/group-form'
import { getGraphqlErrorMessage, optionalText } from '@/features/decks/utils/deck-form-utils'
import type { GroupFormValues } from '@/features/groups/validation/group-form.schema'
import { useCreateGroupMutation } from '@/graphql/generated'
import { PageTitle, Screen } from '@/ui/components'

export function CreateGroupScreen() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [createGroup, { loading }] = useCreateGroupMutation({
    refetchQueries: ['MyGroups'],
  })

  const handleSubmit = async (values: GroupFormValues) => {
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
        setErrorMessage('Could not create group.')
        return
      }

      router.replace(`/groups/${group.id}`)
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, 'Could not create group.'))
    }
  }

  return (
    <Screen>
      <PageTitle title="Create Group" />
      <GroupForm
        errorMessage={errorMessage}
        isSubmitting={loading}
        submitLabel="Create Group"
        onCancel={() => router.back()}
        onSubmit={handleSubmit}
      />
    </Screen>
  )
}
