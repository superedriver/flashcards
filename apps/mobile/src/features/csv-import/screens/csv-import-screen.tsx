import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { CsvImportSummary } from '@/features/csv-import/components/csv-import-summary'
import { CsvInputForm } from '@/features/csv-import/components/csv-input-form'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { deckNeedsLanguageAssignment } from '@/features/decks/utils/deck-language-gate'
import type { PreviewCsvImportMutation } from '@/graphql/generated'
import {
  useConfirmCsvImportMutation,
  useDeckQuery,
  usePreviewCsvImportMutation,
} from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function CsvImportScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { deckId } = useLocalSearchParams<{ deckId: string }>()
  const [csvText, setCsvText] = useState('')
  const [previewResult, setPreviewResult] = useState<
    PreviewCsvImportMutation['previewCsvImport'] | null
  >(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const isPreviewingRef = useRef(false)
  const isConfirmingRef = useRef(false)

  const deckQuery = useDeckQuery({
    skip: !deckId,
    variables: { id: deckId ?? '' },
  })

  useEffect(() => {
    const deck = deckQuery.data?.deck

    if (!deckId || !deck) {
      return
    }

    if (deckNeedsLanguageAssignment(deck)) {
      router.replace(`/decks/${deckId}/assign-languages`)
    }
  }, [deckId, deckQuery.data?.deck, router])

  const [previewCsvImport, { loading: isPreviewing }] = usePreviewCsvImportMutation()
  const [confirmCsvImport, { loading: isConfirming }] = useConfirmCsvImportMutation({
    refetchQueries: ['DeckCards'],
  })

  if (deckQuery.loading) {
    return (
      <Screen>
        <PageTitle title={t('csvImport.title')} />
        <LoadingState message={t('common.loading')} />
      </Screen>
    )
  }

  const handlePreview = async () => {
    if (!deckId || csvText.trim().length === 0) {
      setErrorMessage(t('csvImport.csvRequired'))
      return
    }

    if (isPreviewingRef.current || isPreviewing) {
      return
    }

    isPreviewingRef.current = true
    setErrorMessage(null)
    setSuccessMessage(null)
    setPreviewResult(null)

    try {
      const result = await previewCsvImport({
        variables: {
          input: {
            csvText,
            deckId,
          },
        },
      })

      if (!result.data?.previewCsvImport) {
        setErrorMessage(t('csvImport.previewError'))
        return
      }

      setPreviewResult(result.data.previewCsvImport)
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, t('csvImport.previewError')))
    } finally {
      isPreviewingRef.current = false
    }
  }

  const handleConfirm = async () => {
    if (!previewResult) {
      return
    }

    if (isConfirmingRef.current || isConfirming) {
      return
    }

    isConfirmingRef.current = true
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const result = await confirmCsvImport({
        variables: {
          input: { importId: previewResult.id },
        },
      })

      const count = result.data?.confirmCsvImport.createdCardsCount

      if (count === undefined || count === null) {
        setErrorMessage(t('csvImport.confirmError'))
        return
      }

      setSuccessMessage(t('csvImport.importSuccess', { count }))
      setPreviewResult(null)
      setCsvText('')
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, t('csvImport.confirmError')))
    } finally {
      isConfirmingRef.current = false
    }
  }

  if (!deckId) {
    return (
      <Screen>
        <PageTitle title={t('csvImport.title')} />
        <ErrorState message={t('csvImport.deckIdMissing')} />
        <View style={{ gap: 12, marginTop: 16 }}>
          <AppButton onPress={() => router.replace('/(tabs)/decks')}>
            {t('csvImport.backToDecks')}
          </AppButton>
        </View>
      </Screen>
    )
  }

  return (
    <Screen scrollable>
      <PageTitle title={t('csvImport.title')} />
      <AppText style={{ color: '#666666', marginBottom: 12 }}>{t('csvImport.description')}</AppText>

      {!successMessage ? (
        <CsvInputForm
          csvText={csvText}
          errorMessage={errorMessage}
          isSubmitting={isPreviewing}
          onChangeCsvText={setCsvText}
          onClearError={() => setErrorMessage(null)}
          onPreview={() => void handlePreview()}
        />
      ) : null}

      {previewResult ? (
        <CsvImportSummary
          importResult={previewResult}
          isConfirming={isConfirming}
          onConfirm={() => void handleConfirm()}
        />
      ) : null}

      {successMessage ? (
        <View style={{ gap: 12, marginTop: 16 }}>
          <AppText style={{ color: '#2e7d32', fontSize: 16, fontWeight: '600' }}>
            {successMessage}
          </AppText>
          <AppButton onPress={() => router.replace(`/decks/${deckId}`)}>
            {t('csvImport.viewDeck')}
          </AppButton>
          <AppButton
            onPress={() => {
              setSuccessMessage(null)
              setErrorMessage(null)
            }}
          >
            {t('csvImport.importMore')}
          </AppButton>
        </View>
      ) : null}
    </Screen>
  )
}
