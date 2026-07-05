import type { AuthUser } from '@/features/auth/types/auth-user'

export function getPostAuthRedirectHref(user: AuthUser): '/(auth)/verify-email-prompt' | '/(tabs)' {
  return user.emailVerifiedAt ? '/(tabs)' : '/(auth)/verify-email-prompt'
}
