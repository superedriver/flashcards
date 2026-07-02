import { create } from 'zustand'

import type { AuthStore } from '../types/auth-state'
import type { AuthUser } from '../types/auth-user'

const initialState = {
  user: null,
  isAuthenticated: false,
  isBootstrapping: true,
  isLoading: false,
  error: null,
}

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }),

  setAuthResult: (user: AuthUser) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    }),

  setBootstrapping: (isBootstrapping: boolean) => set({ isBootstrapping }),

  setError: (error: string | null) => set({ error, isLoading: false }),

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setUser: (user: AuthUser | null) =>
    set({
      user,
      isAuthenticated: user !== null,
    }),
}))

export function mapSafeUserToAuthUser(user: {
  id: string
  email: string
  role: AuthUser['role']
  emailVerifiedAt?: string | null
  blockedAt?: string | null
  createdAt: string
  updatedAt: string
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    emailVerifiedAt: user.emailVerifiedAt ?? null,
    blockedAt: user.blockedAt ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}
