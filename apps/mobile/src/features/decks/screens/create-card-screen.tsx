import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { CardForm } from '@/features/decks/components/card-form'
import { getGraphqlErrorMessage, optionalText } from '@/features/decks/utils/deck-form-utils'
import {
  CARD_MUTATION_REFETCH_QUERIES,
  evictCardCountCache,
} from '@/features/decks/utils/card-mutation-cache'
import { useCreateCardMutation } from '@/graphql/generated'
import { PageTitle, Screen } from '@/ui/components'

export function CreateCardScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { deckId } = useLocalSearchParams<{ deckId: string }>()
  const [createCard, { loading }] = useCreateCardMutation({
    awaitRefetchQueries: true,
    refetchQueries: [...CARD_MUTATION_REFETCH_QUERIES],
    update: evictCardCountCache,
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  return (
    <Screen scrollable>
      <View style={{ maxWidth: 640, width: '100%' }}>
        <PageTitle title={t('decks.createCard.title')} />
        <CardForm
          errorMessage={errorMessage}
          isSubmitting={loading}
          submitLabel={t('decks.createCard.submit')}
          submittingLabel={t('decks.createCard.submitting')}
          onCancel={() => router.back()}
          onClearError={() => setErrorMessage(null)}
          onSubmit={async (values) => {
            if (!deckId) {
              return false
            }

            setErrorMessage(null)

            try {
              const result = await createCard({
                variables: {
                  input: {
                    back: values.back,
                    deckId,
                    example: optionalText(values.example),
                    front: values.front,
                    notes: optionalText(values.notes),
                  },
                },
              })

              if (!result.data?.createCard) {
                setErrorMessage(t('decks.createCard.error'))
                return false
              }

              router.replace(`/decks/${deckId}`)
              return true
            } catch (error) {
              setErrorMessage(getGraphqlErrorMessage(error, t('decks.createCard.error')))
              return false
            }
          }}
        />
      </View>
    </Screen>
  )
}
