import { View } from 'react-native'

import { GeneratedExampleListItem } from './generated-example-list-item'

type GeneratedExampleListProps = {
  examples: string[]
  onExampleSelected: (exampleText: string) => void
  onSaveExample?: (exampleText: string) => void
  selectedExample?: string | null
}

export function GeneratedExampleList({
  examples,
  onExampleSelected,
  onSaveExample,
  selectedExample,
}: GeneratedExampleListProps) {
  if (examples.length === 0) {
    return null
  }

  return (
    <View style={{ gap: 8 }}>
      {examples.map((exampleText) => (
        <GeneratedExampleListItem
          key={exampleText}
          exampleText={exampleText}
          isSelected={selectedExample === exampleText}
          onSelect={() => onExampleSelected(exampleText)}
          onSave={onSaveExample ? () => onSaveExample(exampleText) : undefined}
        />
      ))}
    </View>
  )
}
