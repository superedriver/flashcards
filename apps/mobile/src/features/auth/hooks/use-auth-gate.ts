import type { Href } from 'expo-router'
import { usePathname } from 'expo-router'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { getPostAuthRedirectHref } from '@/features/auth/utils/get-post-auth-redirect'

export type AuthGateMode = 'guestOnly' | 'protected' | 'publicRoot'

export type AuthGateResult =
  | { status: 'loading' }
  | { href: Href; status: 'redirect' }
  | { status: 'ready' }

export function useAuthGate(mode: AuthGateMode): AuthGateResult {
  const { isAuthenticated, isBootstrapping, user } = useAuth()
  const pathname = usePathname()

  if (isBootstrapping) {
    return { status: 'loading' }
  }

  if (mode === 'publicRoot') {
    if (isAuthenticated && user) {
      return { status: 'redirect', href: getPostAuthRedirectHref(user) }
    }

    return { status: 'redirect', href: '/(auth)/sign-in' }
  }

  if (mode === 'guestOnly') {
    if (isAuthenticated && user) {
      return { status: 'redirect', href: getPostAuthRedirectHref(user) }
    }

    return { status: 'ready' }
  }

  if (!isAuthenticated) {
    return { status: 'redirect', href: '/(auth)/sign-in' }
  }

  if (user?.blockedAt && !isProfilePath(pathname)) {
    return { status: 'redirect', href: '/(tabs)/profile' }
  }

  return { status: 'ready' }
}

function isProfilePath(pathname: string): boolean {
  return /(^|\/)profile\/?$/.test(pathname)
}
