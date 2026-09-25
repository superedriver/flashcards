import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { setAppLocale } from '@/i18n/init'
import { persistLocale } from '@/i18n/locale-storage'
import { type AppLocale, SUPPORTED_LOCALES } from '@/i18n/types'
import { AppText } from '@/ui/primitives'

export function AuthLocaleSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language as AppLocale

  const handlePress = (locale: AppLocale) => {
    if (locale === current) return
    void setAppLocale(locale).then(() => persistLocale(locale))
  }

  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 4, paddingRight: 16 }}>
      <AppText style={{ color: '#667085', fontSize: 15, marginRight: 2 }}>🌐</AppText>
      {SUPPORTED_LOCALES.map((locale, idx) => (
        <View key={locale} style={{ alignItems: 'center', flexDirection: 'row' }}>
          {idx > 0 ? <AppText style={{ color: '#d0d5dd', marginRight: 4 }}>|</AppText> : null}
          <Pressable onPress={() => handlePress(locale)}>
            <AppText
              style={{
                color: locale === current ? '#2563eb' : '#667085',
                fontWeight: locale === current ? '600' : '400',
                fontSize: 14,
              }}
            >
              {locale.toUpperCase()}
            </AppText>
          </Pressable>
        </View>
      ))}
    </View>
  )
}
