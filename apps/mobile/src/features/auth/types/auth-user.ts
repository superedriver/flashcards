import type { UserRole } from '@/graphql/generated'

export type AuthUser = {
  id: string
  email: string
  role: UserRole
  emailVerifiedAt: string | null
  blockedAt: string | null
  createdAt: string
  updatedAt: string
}
