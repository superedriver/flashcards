import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AppButton, AppCard, AppText } from '@/ui/primitives'

type GeneratedExampleListItemProps = {
  exampleText: string
  isSaving?: boolean
  isSelected: boolean
  onSave?: () => void
  onSelect: () => void
}

export function GeneratedExampleListItem({
  exampleText,
  isSaving = false,
  isSelected,
  onSave,
  onSelect,
}: GeneratedExampleListItemProps) {
  const { t } = useTranslation()

  return (
    <AppCard
      style={{
        borderColor: isSelected ? '#1565c0' : '#cccccc',
        borderWidth: isSelected ? 2 : 1,
        gap: 8,
        marginBottom: 8,
        padding: 12,
      }}
    >
      <AppText>{exampleText}</AppText>
      {isSelected ? (
        <AppText style={{ color: '#1565c0', fontSize: 12, fontWeight: '600' }}>
          {t('aiExamples.selected')}
        </AppText>
      ) : null}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <AppButton disabled={isSaving} onPress={onSelect}>
          {isSelected ? t('aiExamples.selected') : t('aiExamples.useInForm')}
        </AppButton>
        {onSave ? (
          <AppButton disabled={!isSelected || isSaving} onPress={onSave}>
            {isSaving ? t('common.saving') : t('aiExamples.saveToCard')}
          </AppButton>
        ) : null}
      </View>
    </AppCard>
  )
}
