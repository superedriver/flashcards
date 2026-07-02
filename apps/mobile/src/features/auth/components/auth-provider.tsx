import { useEffect, type ReactNode } from 'react'

import { bootstrapAuth } from '../services/bootstrap-auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void bootstrapAuth()
  }, [])

  return children
}
