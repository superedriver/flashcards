import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AppText } from '@/ui/primitives'

export function OrDivider() {
  const { t } = useTranslation()

  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 12 }}>
      <View style={{ backgroundColor: '#e4e7ec', flex: 1, height: 1 }} />
      <AppText style={{ color: '#98a2b3', fontSize: 13 }}>{t('auth.orContinueWith')}</AppText>
      <View style={{ backgroundColor: '#e4e7ec', flex: 1, height: 1 }} />
    </View>
  )
}
