import { ApolloProvider } from '@apollo/client'
import type { ReactNode } from 'react'

import { apolloClient } from './apollo-client'

export function ApolloAppProvider({ children }: { children: ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
