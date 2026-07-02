import type { AuthUser } from './auth-user'

export type AuthState = {
  user: AuthUser | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  isLoading: boolean
  error: string | null
}

export type AuthActions = {
  setAuthResult: (user: AuthUser) => void
  setUser: (user: AuthUser | null) => void
  clearAuth: () => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setBootstrapping: (isBootstrapping: boolean) => void
}

export type AuthStore = AuthState & AuthActions
