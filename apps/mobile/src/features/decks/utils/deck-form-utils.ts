import { getSafeUserErrorMessage } from '@/ui/utils/get-safe-user-error-message'

export function getGraphqlErrorMessage(error: unknown, fallback: string): string {
  return getSafeUserErrorMessage(error, fallback)
}

export function getGraphqlAppCode(error: unknown): string | null {
  if (!error || typeof error !== 'object' || !('graphQLErrors' in error)) {
    return null
  }

  const graphQLErrors = (
    error as {
      graphQLErrors?: Array<{ extensions?: { appCode?: string } }>
    }
  ).graphQLErrors

  const appCode = graphQLErrors?.[0]?.extensions?.appCode

  return typeof appCode === 'string' ? appCode : null
}

export function optionalText(value?: string): string | null {
  const trimmed = value?.trim() ?? ''

  return trimmed === '' ? null : trimmed
}
