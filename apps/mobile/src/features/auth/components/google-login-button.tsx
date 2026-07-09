import { useTranslation } from 'react-i18next'

import { AppButton } from '@/ui/primitives'

export function GoogleLoginButton() {
  const { t } = useTranslation()

  return (
    <AppButton
      accessibilityHint={t('auth.google.hint')}
      accessibilityLabel={t('auth.google.label')}
      disabled
      onPress={() => undefined}
    >
      {t('auth.google.label')}
    </AppButton>
  )
}
