import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { getCurrentLocale } from '@/i18n'
import {
  useGenerateCardExamplesMutation,
  useSaveGeneratedCardExampleMutation,
} from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, LoadingState } from '@/ui/components'

import { GeneratedExampleList } from './generated-example-list'

export type AiExampleGeneratorProps = {
  cardId: string
  currentExample?: string | null
  onExampleSelected: (exampleText: string) => void
}

export function AiExampleGenerator({
  cardId,
  currentExample,
  onExampleSelected,
}: AiExampleGeneratorProps) {
  const { t } = useTranslation()
  const [examples, setExamples] = useState<string[]>([])
  const [selectedExample, setSelectedExample] = useState<string | null>(currentExample ?? null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [savingExample, setSavingExample] = useState<string | null>(null)
  const isGeneratingRef = useRef(false)

  const [generateCardExamples, { loading: isGenerating }] = useGenerateCardExamplesMutation()
  const [saveGeneratedCardExample, { loading: isSaving }] = useSaveGeneratedCardExampleMutation({
    refetchQueries: ['DeckCards'],
  })

  const handleGenerate = async () => {
    if (isGeneratingRef.current || isGenerating || isSaving) {
      return
    }

    isGeneratingRef.current = true
    setErrorMessage(null)
    setFeedback(null)

    try {
      const result = await generateCardExamples({
        variables: {
          input: {
            cardId,
            locale: getCurrentLocale(),
          },
        },
      })

      const generated = result.data?.generateCardExamples.examples.map((item) => item.text) ?? []

      if (generated.length === 0) {
        setErrorMessage(t('aiExamples.noExamples'))
        return
      }

      setExamples(generated)
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, t('aiExamples.generateError')))
    } finally {
      isGeneratingRef.current = false
    }
  }

  const handleSelect = (exampleText: string) => {
    setSelectedExample(exampleText)
    onExampleSelected(exampleText)
    setFeedback(t('aiExamples.selectedFeedback'))
  }

  const handleSave = async (exampleText: string) => {
    if (isSaving) {
      return
    }

    setSavingExample(exampleText)
    setErrorMessage(null)
    setFeedback(null)

    try {
      const result = await saveGeneratedCardExample({
        variables: {
          input: {
            cardId,
            exampleText,
          },
        },
      })

      if (!result.data?.saveGeneratedCardExample.card) {
        setErrorMessage(t('aiExamples.saveError'))
        return
      }

      setSelectedExample(exampleText)
      onExampleSelected(exampleText)
      setFeedback(t('aiExamples.savedFeedback'))
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, t('aiExamples.saveError')))
    } finally {
      setSavingExample(null)
    }
  }

  return (
    <View style={{ gap: 12, marginBottom: 16 }}>
      <AppText style={{ fontWeight: '600' }}>{t('aiExamples.title')}</AppText>
      <AppText style={{ color: '#666666', fontSize: 14 }}>{t('aiExamples.description')}</AppText>
      <AppButton disabled={isGenerating || isSaving} onPress={() => void handleGenerate()}>
        {isGenerating ? t('aiExamples.generating') : t('aiExamples.generate')}
      </AppButton>
      {isGenerating ? <LoadingState message={t('aiExamples.generatingMessage')} /> : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      {feedback ? <AppText style={{ color: '#2e7d32' }}>{feedback}</AppText> : null}
      <GeneratedExampleList
        examples={examples}
        isSaving={isSaving}
        savingExample={savingExample}
        selectedExample={selectedExample}
        onExampleSelected={handleSelect}
        onSaveExample={(exampleText) => void handleSave(exampleText)}
      />
    </View>
  )
}
