import type { ApolloError } from '@apollo/client'

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

export function getSafeUserErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && 'graphQLErrors' in error) {
    const apolloError = error as ApolloError
    const graphQlMessage = apolloError.graphQLErrors[0]?.message?.trim()

    if (graphQlMessage && isUserFriendlyMessage(graphQlMessage)) {
      return graphQlMessage
    }

    const networkMessage = apolloError.networkError?.message?.trim()

    if (networkMessage && isUserFriendlyMessage(networkMessage)) {
      return networkMessage
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
