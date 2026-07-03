import type { ApolloError } from '@apollo/client'

export function getGraphqlErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && 'graphQLErrors' in error) {
    const apolloError = error as ApolloError
    const message = apolloError.graphQLErrors[0]?.message

    if (message) {
      return message
    }
  }

  return fallback
}

export function optionalText(value?: string): string | null {
  const trimmed = value?.trim() ?? ''

  return trimmed === '' ? null : trimmed
}
