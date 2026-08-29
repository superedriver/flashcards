import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { AppText } from '@/ui/primitives'
import { buttonA11yProps } from '@/ui/utils/accessibility'

import { GeneratedExampleListItem } from './generated-example-list-item'

type GeneratedExampleListProps = {
  examples: string[]
  onExampleSelected: (exampleText: string) => void
  onUseSelected: () => void
  selectedExample?: string | null
}

export function GeneratedExampleList({
  examples,
  onExampleSelected,
  onUseSelected,
  selectedExample,
}: GeneratedExampleListProps) {
  const { t } = useTranslation()
  const canUseSelected = Boolean(selectedExample)

  if (examples.length === 0) {
    return null
  }

  return (
    <View style={{ gap: 8 }}>
      <AppText style={{ color: '#344054', fontSize: 13, fontWeight: '700' }}>
        {t('aiExamples.suggestions')}
      </AppText>
      {examples.map((exampleText) => (
        <GeneratedExampleListItem
          key={exampleText}
          exampleText={exampleText}
          isSelected={selectedExample === exampleText}
          onSelect={() => onExampleSelected(exampleText)}
        />
      ))}
      <Pressable
        {...buttonA11yProps(t('aiExamples.useSelected'))}
        disabled={!canUseSelected}
        onPress={onUseSelected}
        style={{
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: '#1a56db',
          borderRadius: 8,
          opacity: canUseSelected ? 1 : 0.45,
          paddingHorizontal: 14,
          paddingVertical: 8,
        }}
      >
        <AppText style={{ color: '#ffffff', fontSize: 14, fontWeight: '700' }}>
          {t('aiExamples.useSelected')}
        </AppText>
      </Pressable>
    </View>
  )
}
