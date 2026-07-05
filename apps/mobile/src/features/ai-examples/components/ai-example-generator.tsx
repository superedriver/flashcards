import { useRef, useState } from 'react'
import { View } from 'react-native'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
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
          input: { cardId },
        },
      })

      const generated = result.data?.generateCardExamples.examples.map((item) => item.text) ?? []

      if (generated.length === 0) {
        setErrorMessage('No examples were generated. Try again.')
        return
      }

      setExamples(generated)
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, 'Could not generate examples.'))
    } finally {
      isGeneratingRef.current = false
    }
  }

  const handleSelect = (exampleText: string) => {
    setSelectedExample(exampleText)
    onExampleSelected(exampleText)
    setFeedback('Example added to the form. Save the card or use Save to card to persist it.')
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
        setErrorMessage('Could not save example.')
        return
      }

      setSelectedExample(exampleText)
      onExampleSelected(exampleText)
      setFeedback('Example saved to card.')
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, 'Could not save example.'))
    } finally {
      setSavingExample(null)
    }
  }

  return (
    <View style={{ gap: 12, marginBottom: 16 }}>
      <AppText style={{ fontWeight: '600' }}>AI examples</AppText>
      <AppText style={{ color: '#666666', fontSize: 14 }}>
        Generate example sentences for this card. Examples are not saved until you choose Save to
        card.
      </AppText>
      <AppButton disabled={isGenerating || isSaving} onPress={() => void handleGenerate()}>
        {isGenerating ? 'Generating...' : 'Generate examples'}
      </AppButton>
      {isGenerating ? <LoadingState message="Generating examples..." /> : null}
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
