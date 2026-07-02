import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'

import { env } from '@/config/env'
import { authErrorLink, authLink } from '@/features/auth/services/apollo-auth-links'

const httpLink = new HttpLink({
  uri: env.apiUrl,
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([authErrorLink, authLink, httpLink]),
})
