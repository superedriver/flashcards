import { useTranslation } from 'react-i18next'

import { ChangePasswordForm } from '@/features/profile/components/change-password-form'
import { Screen } from '@/ui/components'
import { PageTitle } from '@/ui/components'

export default function ChangePasswordScreen() {
  const { t } = useTranslation()

  return (
    <Screen scrollable>
      <PageTitle title={t('profile.changePassword.title')} />
      <ChangePasswordForm />
    </Screen>
  )
}
