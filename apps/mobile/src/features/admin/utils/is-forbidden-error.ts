import { i18n } from '@/i18n'

export function isForbiddenError(error: unknown): boolean {
  if (error instanceof Error && 'graphQLErrors' in error) {
    const message = (error as { graphQLErrors: Array<{ message?: string }> }).graphQLErrors[0]
      ?.message

    return Boolean(message?.toLowerCase().includes('forbidden') || message?.includes('403'))
  }

  return false
}

export function getForbiddenMessage(): string {
  return i18n.t('admin.forbidden')
}
