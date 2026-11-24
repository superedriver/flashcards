import { CombinedGraphQLErrors } from '@apollo/client/errors'

const INTERNAL_PATTERNS = [
  /\n\s+at\s+/,
  /\bat\s+\S+\s+\(/,
  /prisma/i,
  /ECONNREFUSED/i,
  /ENOTFOUND/i,
  /stack trace/i,
  /invalid `prisma/i,
]

const MAX_MESSAGE_LENGTH = 200

function isUserFriendlyMessage(message: string): boolean {
  const trimmed = message.trim()

  if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH) {
    return false
  }

  return !INTERNAL_PATTERNS.some((pattern) => pattern.test(trimmed))
}

export function getSafeUserErrorMessage(
  error: unknown,
  fallback: string,
  t?: (key: string) => string,
  appCodeMap?: Record<string, string>,
): string {
  if (CombinedGraphQLErrors.is(error)) {
    if (t && appCodeMap) {
      const appCode = error.errors[0]?.extensions?.appCode
      if (typeof appCode === 'string' && appCodeMap[appCode]) {
        return t(appCodeMap[appCode])
      }
    }

    return fallback
  }

  if (error instanceof Error) {
    const message = error.message.trim()

    if (message && isUserFriendlyMessage(message)) {
      return message
    }
  }

  if (typeof error === 'string') {
    const trimmed = error.trim()

    if (trimmed && isUserFriendlyMessage(trimmed)) {
      return trimmed
    }
  }

  return fallback
}
