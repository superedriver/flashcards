import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import { env } from '@/config/env'

const httpLink = new HttpLink({
  uri: env.apiUrl,
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
})
