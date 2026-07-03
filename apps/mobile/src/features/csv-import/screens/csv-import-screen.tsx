import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
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

  const [previewCsvImport, { loading: isPreviewing }] = usePreviewCsvImportMutation()
  const [confirmCsvImport, { loading: isConfirming }] = useConfirmCsvImportMutation({
    refetchQueries: ['DeckCards'],
  })

  const handlePreview = async () => {
    if (!deckId || csvText.trim().length === 0) {
      setErrorMessage('CSV text is required.')
      return
    }

    setErrorMessage(null)
    setSuccessMessage(null)

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
    }
  }

  const handleConfirm = async () => {
    if (!previewResult) {
      return
    }

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

      setSuccessMessage(`Imported ${count} cards successfully.`)
      setPreviewResult(null)
      setCsvText('')
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, 'Could not confirm CSV import.'))
    }
  }

  if (!deckId) {
    return (
      <Screen>
        <PageTitle title="Import CSV" />
        <ErrorState message="Deck id is missing." />
      </Screen>
    )
  }

  return (
    <Screen>
      <PageTitle title="Import CSV" />
      <CsvInputForm
        csvText={csvText}
        errorMessage={errorMessage}
        isSubmitting={isPreviewing}
        onChangeCsvText={setCsvText}
        onPreview={() => void handlePreview()}
      />

      {previewResult ? (
        <CsvImportSummary
          importResult={previewResult}
          isConfirming={isConfirming}
          onConfirm={() => void handleConfirm()}
        />
      ) : null}

      {successMessage ? (
        <View style={{ gap: 12, marginTop: 16 }}>
          <AppText>{successMessage}</AppText>
          <AppButton onPress={() => router.replace(`/decks/${deckId}`)}>Back to deck</AppButton>
        </View>
      ) : null}
    </Screen>
  )
}
