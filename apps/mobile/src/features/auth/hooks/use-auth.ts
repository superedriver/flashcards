import { useAuthStore } from '../state/auth-store'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)
  const setAuthResult = useAuthStore((state) => state.setAuthResult)
  const setUser = useAuthStore((state) => state.setUser)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const setLoading = useAuthStore((state) => state.setLoading)
  const setError = useAuthStore((state) => state.setError)

  return {
    clearAuth,
    error,
    isAuthenticated,
    isBootstrapping,
    isLoading,
    setAuthResult,
    setError,
    setLoading,
    setUser,
    user,
  }
}
