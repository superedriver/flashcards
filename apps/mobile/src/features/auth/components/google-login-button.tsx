import { AppButton } from '@/ui/primitives'

export function GoogleLoginButton() {
  return (
    <AppButton
      accessibilityHint="Google sign-in is not available yet."
      accessibilityLabel="Continue with Google (coming soon)"
      disabled
      onPress={() => undefined}
    >
      Continue with Google (Coming soon)
    </AppButton>
  )
}
