import { getSafeUserErrorMessage } from '@/ui/utils/get-safe-user-error-message'

export function getGraphqlErrorMessage(error: unknown, fallback: string): string {
  return getSafeUserErrorMessage(error, fallback)
}

export function optionalText(value?: string): string | null {
  const trimmed = value?.trim() ?? ''

  return trimmed === '' ? null : trimmed
}
