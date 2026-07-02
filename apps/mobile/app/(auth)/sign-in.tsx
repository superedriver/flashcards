import { AppButton } from '@/ui/primitives'
import { PageTitle, Screen } from '@/ui/components'

export default function SignInScreen() {
  return (
    <Screen>
      <PageTitle title="Sign In" />
      <AppButton disabled>Sign In</AppButton>
    </Screen>
  )
}
