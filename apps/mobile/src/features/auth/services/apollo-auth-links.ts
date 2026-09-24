import { CombinedGraphQLErrors } from '@apollo/client/errors'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { Observable } from 'rxjs'

import { handleSessionExpired } from './handle-session-expired'
import { authTokenService } from './auth-token-service'
import { performRefreshToken } from './auth-session'

let isRefreshing = false
let pendingRequests: Array<() => void> = []

function resolvePendingRequests() {
  pendingRequests.forEach((callback) => callback())
  pendingRequests = []
}

export const authLink = setContext((_, { headers }) => {
  const accessToken = authTokenService.getAccessToken()

  if (!accessToken) {
    return { headers }
  }

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${accessToken}`,
    },
  }
})

export const authErrorLink = onError(({ error, operation, forward }) => {
  if (!CombinedGraphQLErrors.is(error)) {
    return
  }

  const isUnauthenticated = error.errors.some((e) => e.extensions?.code === 'UNAUTHENTICATED')

  if (!isUnauthenticated) {
    return
  }

  const context = operation.getContext() as { alreadyRetriedAuth?: boolean }

  if (context.alreadyRetriedAuth) {
    return
  }

  return new Observable((observer) => {
    const retryOperation = () => {
      const subscriber = {
        complete: () => observer.complete(),
        error: (err: unknown) => observer.error(err),
        next: observer.next.bind(observer),
      }

      operation.setContext({ alreadyRetriedAuth: true })
      forward(operation).subscribe(subscriber)
    }

    if (isRefreshing) {
      pendingRequests.push(retryOperation)
      return
    }

    isRefreshing = true

    void performRefreshToken()
      .then(async (success) => {
        if (!success) {
          await handleSessionExpired()
          observer.error(new Error('Session expired'))
          return
        }

        resolvePendingRequests()
        retryOperation()
      })
      .catch(async () => {
        await handleSessionExpired()
        observer.error(new Error('Session expired'))
      })
      .finally(() => {
        isRefreshing = false
      })
  })
})
