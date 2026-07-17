import { useTranslation } from 'react-i18next'

import { AppText } from '@/ui/primitives'
import { PageTitle, Screen } from '@/ui/components'

export default function HomeScreen() {
  const { t } = useTranslation()

  return (
    <Screen>
      <PageTitle title={t('common.tabs.home')} />
      <AppText>{t('common.homeWelcome')}</AppText>
    </Screen>
  )
}
