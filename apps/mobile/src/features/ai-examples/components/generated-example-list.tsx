import { View } from 'react-native'

import { AppText } from '@/ui/primitives'

import { GeneratedExampleListItem } from './generated-example-list-item'

type GeneratedExampleListProps = {
  examples: string[]
  isSaving?: boolean
  onExampleSelected: (exampleText: string) => void
  onSaveExample?: (exampleText: string) => void
  selectedExample?: string | null
  savingExample?: string | null
}

export function GeneratedExampleList({
  examples,
  isSaving = false,
  onExampleSelected,
  onSaveExample,
  selectedExample,
  savingExample,
}: GeneratedExampleListProps) {
  if (examples.length === 0) {
    return null
  }

  return (
    <View style={{ gap: 8 }}>
      <AppText style={{ color: '#666666', fontSize: 14 }}>
        Select a candidate to fill the form, then save to persist it on the card.
      </AppText>
      {examples.map((exampleText) => (
        <GeneratedExampleListItem
          key={exampleText}
          exampleText={exampleText}
          isSaving={isSaving && savingExample === exampleText}
          isSelected={selectedExample === exampleText}
          onSelect={() => onExampleSelected(exampleText)}
          onSave={onSaveExample ? () => onSaveExample(exampleText) : undefined}
        />
      ))}
    </View>
  )
}
