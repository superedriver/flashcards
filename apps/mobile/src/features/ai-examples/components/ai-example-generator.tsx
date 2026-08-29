import { Ionicons } from '@expo/vector-icons'
import { type ReactNode, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { getCurrentLocale } from '@/i18n'
import { useGenerateCardExamplesMutation } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'
import { buttonA11yProps } from '@/ui/utils/accessibility'

import { GeneratedExampleList } from './generated-example-list'

export type AiExampleGeneratorRenderProps = {
  generateButton: ReactNode
  suggestions: ReactNode
}

export type AiExampleGeneratorProps = {
  cardId: string
  children: (parts: AiExampleGeneratorRenderProps) => ReactNode
  onExampleSelected: (exampleText: string) => void
}

export function AiExampleGenerator({
  cardId,
  children,
  onExampleSelected,
}: AiExampleGeneratorProps) {
  const { t } = useTranslation()
  const [examples, setExamples] = useState<string[]>([])
  const [selectedExample, setSelectedExample] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isGeneratingRef = useRef(false)

  const [generateCardExamples, { loading: isGenerating }] = useGenerateCardExamplesMutation()

  const handleGenerate = async () => {
    if (isGeneratingRef.current || isGenerating) {
      return
    }

    isGeneratingRef.current = true
    setErrorMessage(null)
    setSelectedExample(null)
    setExamples([])

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

  const handleUseSelected = () => {
    if (!selectedExample) {
      return
    }

    onExampleSelected(selectedExample)
  }

  const generateButton = (
    <Pressable
      {...buttonA11yProps(t('aiExamples.generate'))}
      disabled={isGenerating}
      onPress={() => void handleGenerate()}
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4,
        opacity: isGenerating ? 0.5 : 1,
        paddingVertical: 2,
      }}
    >
      <Ionicons color="#1a56db" name="sparkles-outline" size={16} />
      <AppText style={{ color: '#1a56db', fontSize: 14, fontWeight: '600' }}>
        {isGenerating ? t('aiExamples.generating') : t('aiExamples.generate')}
      </AppText>
    </Pressable>
  )

  const suggestions = (
    <View style={{ gap: 8 }}>
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      <GeneratedExampleList
        examples={examples}
        selectedExample={selectedExample}
        onExampleSelected={setSelectedExample}
        onUseSelected={handleUseSelected}
      />
    </View>
  )

  return children({ generateButton, suggestions })
}
