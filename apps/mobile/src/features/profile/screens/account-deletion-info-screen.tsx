import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { PageTitle, Screen } from '@/ui/components'
import { AppButton, AppText } from '@/ui/primitives'

export function AccountDeletionInfoScreen() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Screen scrollable variant="narrow">
      <PageTitle title={t('profile.accountDeletion.title')} />
      <View style={{ gap: 16 }}>
        <AppText>{t('profile.accountDeletion.intro')}</AppText>
        <View style={{ gap: 8 }}>
          <AppText accessibilityRole="header" style={{ fontSize: 18, fontWeight: '700' }}>
            {t('profile.accountDeletion.howTitle')}
          </AppText>
          <AppText>{t('profile.accountDeletion.howBody')}</AppText>
        </View>
        <View style={{ gap: 8 }}>
          <AppText accessibilityRole="header" style={{ fontSize: 18, fontWeight: '700' }}>
            {t('profile.accountDeletion.removedTitle')}
          </AppText>
          <AppText>{t('profile.accountDeletion.removedBody')}</AppText>
        </View>
        <AppText>{t('profile.accountDeletion.irreversible')}</AppText>
        <AppButton onPress={() => router.push('/(auth)/sign-in')}>
          {t('profile.accountDeletion.cta')}
        </AppButton>
      </View>
    </Screen>
  )
}
