import { useLocalSearchParams, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { View } from 'react-native'

import { CsvImportSummary } from '@/features/csv-import/components/csv-import-summary'
import { CsvInputForm } from '@/features/csv-import/components/csv-input-form'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import type { PreviewCsvImportMutation } from '@/graphql/generated'
import { useConfirmCsvImportMutation, usePreviewCsvImportMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, PageTitle, Screen } from '@/ui/components'

export function CsvImportScreen() {
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

  const [previewCsvImport, { loading: isPreviewing }] = usePreviewCsvImportMutation()
  const [confirmCsvImport, { loading: isConfirming }] = useConfirmCsvImportMutation({
    refetchQueries: ['DeckCards'],
  })

  const handlePreview = async () => {
    if (!deckId || csvText.trim().length === 0) {
      setErrorMessage('CSV text is required.')
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
        setErrorMessage('Could not preview CSV import.')
        return
      }

      setPreviewResult(result.data.previewCsvImport)
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, 'Could not preview CSV import.'))
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
        setErrorMessage('Could not confirm CSV import.')
        return
      }

      setSuccessMessage(
        count === 1 ? 'Imported 1 card successfully.' : `Imported ${count} cards successfully.`,
      )
      setPreviewResult(null)
      setCsvText('')
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, 'Could not confirm CSV import.'))
    } finally {
      isConfirmingRef.current = false
    }
  }

  if (!deckId) {
    return (
      <Screen>
        <PageTitle title="Import CSV" />
        <ErrorState message="Deck id is missing." />
        <View style={{ gap: 12, marginTop: 16 }}>
          <AppButton onPress={() => router.replace('/(tabs)/decks')}>Back to decks</AppButton>
        </View>
      </Screen>
    )
  }

  return (
    <Screen scrollable>
      <PageTitle title="Import CSV" />
      <AppText style={{ color: '#666666', marginBottom: 12 }}>
        Preview validates your CSV without creating cards. Confirm import to add valid rows.
      </AppText>

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
          <AppButton onPress={() => router.replace(`/decks/${deckId}`)}>View deck</AppButton>
          <AppButton
            onPress={() => {
              setSuccessMessage(null)
              setErrorMessage(null)
            }}
          >
            Import more cards
          </AppButton>
        </View>
      ) : null}
    </Screen>
  )
}
