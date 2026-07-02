import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { Observable } from '@apollo/client/utilities'

import { authTokenService } from './auth-token-service'
import { clearAuthSession, performRefreshToken } from './auth-session'

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

export const authErrorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (!graphQLErrors?.length) {
    return
  }

  const isUnauthenticated = graphQLErrors.some(
    (error) => error.extensions?.code === 'UNAUTHENTICATED',
  )

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
        complete: observer.complete.bind(observer),
        error: observer.error.bind(observer),
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
          await clearAuthSession()
          observer.error(new Error('Session expired'))
          return
        }

        resolvePendingRequests()
        retryOperation()
      })
      .catch(async () => {
        await clearAuthSession()
        observer.error(new Error('Session expired'))
      })
      .finally(() => {
        isRefreshing = false
      })
  })
})
