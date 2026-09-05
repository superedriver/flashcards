import { useLocalSearchParams, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { CardForm } from '@/features/decks/components/card-form'
import { useBulkCardQueue } from '@/features/decks/hooks/use-bulk-card-queue'
import {
  CARD_MUTATION_REFETCH_QUERIES,
  evictCardCountCache,
} from '@/features/decks/utils/card-mutation-cache'
import { confirmActionAsync } from '@/features/decks/utils/confirm-destructive'
import {
  getGraphqlAppCode,
  getGraphqlErrorMessage,
  optionalText,
} from '@/features/decks/utils/deck-form-utils'
import {
  parseBulkCardLines,
  type BulkCardFormatError,
  type BulkCardPair,
} from '@/features/decks/utils/parse-bulk-card-lines'
import {
  CardDuplicateKind,
  useCheckCardDuplicatesLazyQuery,
  useCreateCardMutation,
  type CheckCardDuplicateHit,
} from '@/graphql/generated'
import { PageTitle, Screen } from '@/ui/components'

export function CreateCardScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { deckId } = useLocalSearchParams<{ deckId: string }>()
  const bulkQueue = useBulkCardQueue()
  const bulkFillKeyRef = useRef(0)
  const [checkCardDuplicates, { loading: isCheckingDuplicates }] = useCheckCardDuplicatesLazyQuery()
  const [createCard, { loading }] = useCreateCardMutation({
    awaitRefetchQueries: true,
    refetchQueries: [...CARD_MUTATION_REFETCH_QUERIES],
    update: evictCardCountCache,
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [bulkFrontMessages, setBulkFrontMessages] = useState<string[] | null>(null)
  const [bulkFill, setBulkFill] = useState<{
    back: string
    front: string
    key: number
  } | null>(null)

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

  const formatDuplicateHit = (hit: CheckCardDuplicateHit, pairs: BulkCardPair[]): string => {
    const lineNumber = pairs[hit.index]?.lineNumber ?? hit.index + 1

    if (hit.kind === CardDuplicateKind.OtherDeck && hit.deckTitle) {
      return t('decks.createCard.bulkDuplicateOtherDeck', {
        line: lineNumber,
        title: hit.deckTitle,
      })
    }

    if (hit.kind === CardDuplicateKind.InBatch) {
      return t('decks.createCard.bulkDuplicateInBatch', { line: lineNumber })
    }

    return t('decks.createCard.bulkDuplicateThisDeck', { line: lineNumber })
  }

  return (
    <Screen scrollable>
      <View style={{ maxWidth: 640, width: '100%' }}>
        <PageTitle
          title={
            bulkQueue.length > 0
              ? t('decks.createCard.titleWithCount', { count: bulkQueue.length })
              : t('decks.createCard.title')
          }
        />
        <CardForm
          bulkFill={bulkFill}
          bulkFrontMessages={bulkFrontMessages}
          errorMessage={errorMessage}
          isSubmitting={loading || isCheckingDuplicates}
          resetOnSuccess
          showSkip={bulkQueue.length > 0}
          skipLabel={t('decks.createCard.skip')}
          submitLabel={t('decks.createCard.submit')}
          submittingLabel={t('decks.createCard.submitting')}
          successMessage={successMessage}
          cancelLabel={t('decks.createCard.backToDeck')}
          onCancel={() => router.back()}
          onClearError={() => {
            setErrorMessage(null)
            setBulkFrontMessages(null)
          }}
          onDiscardQueue={() => {
            bulkQueue.clear()
            setBulkFill(null)
            setBulkFrontMessages(null)
            setErrorMessage(null)
            setSuccessMessage(null)
          }}
          queueLength={bulkQueue.length}
          onSkip={async () => {
            const nextPair = bulkQueue.skip()
            setSuccessMessage(null)

            if (!nextPair) {
              setBulkFill(null)
              setBulkFrontMessages(null)
              setErrorMessage(null)
              return 'empty'
            }

            bulkFillKeyRef.current += 1
            setBulkFill({
              back: nextPair.back,
              front: nextPair.front,
              key: bulkFillKeyRef.current,
            })
            setBulkFrontMessages(null)
            setErrorMessage(null)
            return 'next'
          }}
          onFrontPaste={async (text, dirtySides) => {
            setSuccessMessage(null)
            const parsed = parseBulkCardLines(text)

            if (parsed.formatErrors.length > 0) {
              setBulkFrontMessages(parsed.formatErrors.map(formatBulkError))
              return 'handled'
            }

            if (parsed.tooManyValid) {
              setBulkFrontMessages([t('decks.createCard.bulkTooMany')])
              return 'handled'
            }

            if (parsed.validPairs.length < 2) {
              setBulkFrontMessages(null)
              return 'apply-text'
            }

            if (!deckId) {
              return 'handled'
            }

            try {
              const duplicateResult = await checkCardDuplicates({
                fetchPolicy: 'network-only',
                variables: {
                  input: {
                    deckId,
                    pairs: parsed.validPairs.map((pair) => ({
                      back: pair.back,
                      front: pair.front,
                    })),
                  },
                },
              })

              if (duplicateResult.error) {
                setBulkFrontMessages([
                  getGraphqlErrorMessage(duplicateResult.error, t('decks.createCard.error')),
                ])
                return 'handled'
              }

              const hits = duplicateResult.data?.checkCardDuplicates.hits ?? []

              if (hits.length > 0) {
                setBulkFrontMessages(hits.map((hit) => formatDuplicateHit(hit, parsed.validPairs)))
                return 'handled'
              }

              if (bulkQueue.length > 0) {
                const shouldReplace = await confirmActionAsync(
                  t('decks.createCard.replaceQueueTitle'),
                  t('decks.createCard.replaceQueueMessage', { count: bulkQueue.length }),
                )

                if (!shouldReplace) {
                  return 'handled'
                }
              } else if (dirtySides.back || dirtySides.example || dirtySides.notes) {
                const shouldClear = await confirmActionAsync(
                  t('decks.createCard.dirtyPasteTitle'),
                  t('decks.createCard.dirtyPasteMessage'),
                )

                if (!shouldClear) {
                  return 'handled'
                }
              }

              const firstPair = parsed.validPairs[0]

              if (!firstPair) {
                return 'handled'
              }

              setBulkFrontMessages(null)
              bulkQueue.start(parsed.validPairs)
              bulkFillKeyRef.current += 1
              setBulkFill({
                back: firstPair.back,
                front: firstPair.front,
                key: bulkFillKeyRef.current,
              })
              return 'handled'
            } catch (error) {
              setBulkFrontMessages([getGraphqlErrorMessage(error, t('decks.createCard.error'))])
              return 'handled'
            }
          }}
          onSubmit={async (values) => {
            if (!deckId) {
              return false
            }

            setErrorMessage(null)
            setSuccessMessage(null)

            try {
              const remainingQueue = bulkQueue.pairs.slice(1)
              const duplicateResult = await checkCardDuplicates({
                fetchPolicy: 'network-only',
                variables: {
                  input: {
                    deckId,
                    pairs: [
                      { back: values.back, front: values.front },
                      ...remainingQueue.map((pair) => ({
                        back: pair.back,
                        front: pair.front,
                      })),
                    ],
                  },
                },
              })

              if (duplicateResult.error) {
                setErrorMessage(
                  getGraphqlErrorMessage(duplicateResult.error, t('decks.createCard.error')),
                )
                return false
              }

              const hit = (duplicateResult.data?.checkCardDuplicates.hits ?? []).find(
                (item) => item.index === 0,
              )

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
              setSuccessMessage(t('decks.createCard.success'))
              const nextPair = bulkQueue.length > 0 ? bulkQueue.skip() : null

              if (nextPair) {
                bulkFillKeyRef.current += 1
                setBulkFill({
                  back: nextPair.back,
                  front: nextPair.front,
                  key: bulkFillKeyRef.current,
                })
              } else {
                bulkQueue.clear()
                setBulkFill(null)
              }

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
