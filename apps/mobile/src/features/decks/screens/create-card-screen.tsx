import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { CardForm } from '@/features/decks/components/card-form'
import {
  CARD_MUTATION_REFETCH_QUERIES,
  evictCardCountCache,
} from '@/features/decks/utils/card-mutation-cache'
import {
  getGraphqlAppCode,
  getGraphqlErrorMessage,
  optionalText,
} from '@/features/decks/utils/deck-form-utils'
import {
  parseBulkCardLines,
  type BulkCardFormatError,
} from '@/features/decks/utils/parse-bulk-card-lines'
import {
  CardDuplicateKind,
  useCheckCardDuplicatesLazyQuery,
  useCreateCardMutation,
} from '@/graphql/generated'
import { PageTitle, Screen } from '@/ui/components'

export function CreateCardScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { deckId } = useLocalSearchParams<{ deckId: string }>()
  const [checkCardDuplicates, { loading: isCheckingDuplicates }] = useCheckCardDuplicatesLazyQuery()
  const [createCard, { loading }] = useCreateCardMutation({
    awaitRefetchQueries: true,
    refetchQueries: [...CARD_MUTATION_REFETCH_QUERIES],
    update: evictCardCountCache,
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [bulkFrontMessages, setBulkFrontMessages] = useState<string[] | null>(null)

  const formatBulkError = (error: BulkCardFormatError): string => {
    switch (error.code) {
      case 'INVALID_FORMAT':
        return t('decks.createCard.bulkInvalidFormat', { line: error.lineNumber })
      case 'FRONT_REQUIRED':
        return t('decks.createCard.bulkFrontRequired', { line: error.lineNumber })
      case 'BACK_REQUIRED':
        return t('decks.createCard.bulkBackRequired', { line: error.lineNumber })
      case 'FRONT_TOO_LONG':
        return t('decks.createCard.bulkFrontTooLong', { line: error.lineNumber })
      case 'BACK_TOO_LONG':
        return t('decks.createCard.bulkBackTooLong', { line: error.lineNumber })
    }
  }

  return (
    <Screen scrollable>
      <View style={{ maxWidth: 640, width: '100%' }}>
        <PageTitle title={t('decks.createCard.title')} />
        <CardForm
          bulkFrontMessages={bulkFrontMessages}
          errorMessage={errorMessage}
          isSubmitting={loading || isCheckingDuplicates}
          resetOnSuccess
          submitLabel={t('decks.createCard.submit')}
          submittingLabel={t('decks.createCard.submitting')}
          onCancel={() => router.back()}
          onClearError={() => setErrorMessage(null)}
          onFrontTextChange={(text, isPaste) => {
            if (!isPaste) {
              setBulkFrontMessages(null)
              return
            }

            const parsed = parseBulkCardLines(text)

            if (parsed.formatErrors.length > 0) {
              setBulkFrontMessages(parsed.formatErrors.map(formatBulkError))
              return
            }

            if (parsed.tooManyValid) {
              setBulkFrontMessages([t('decks.createCard.bulkTooMany')])
              return
            }

            setBulkFrontMessages(null)
          }}
          onSubmit={async (values) => {
            if (!deckId) {
              return false
            }

            setErrorMessage(null)

            try {
              const duplicateResult = await checkCardDuplicates({
                fetchPolicy: 'network-only',
                variables: {
                  input: {
                    deckId,
                    pairs: [{ back: values.back, front: values.front }],
                  },
                },
              })

              if (duplicateResult.error) {
                setErrorMessage(
                  getGraphqlErrorMessage(duplicateResult.error, t('decks.createCard.error')),
                )
                return false
              }

              const hit = duplicateResult.data?.checkCardDuplicates.hits[0]

              if (hit) {
                setErrorMessage(
                  hit.kind === CardDuplicateKind.OtherDeck && hit.deckTitle
                    ? t('decks.createCard.duplicateOtherDeck', { title: hit.deckTitle })
                    : t('decks.createCard.duplicateThisDeck'),
                )
                return false
              }

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

              setBulkFrontMessages(null)
              return true
            } catch (error) {
              setErrorMessage(
                getGraphqlAppCode(error) === 'CARD_DUPLICATE'
                  ? t('decks.createCard.duplicateThisDeck')
                  : getGraphqlErrorMessage(error, t('decks.createCard.error')),
              )
              return false
            }
          }}
        />
      </View>
    </Screen>
  )
}
