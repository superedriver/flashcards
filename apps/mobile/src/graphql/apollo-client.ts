import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { Platform } from 'react-native'

import { env } from '@/config/env'
import { authErrorLink, authLink } from '@/features/auth/services/apollo-auth-links'

const httpLink = new HttpLink({
  credentials: Platform.OS === 'web' ? 'include' : 'same-origin',
  headers: {
    'apollo-require-preflight': 'true',
  },
  uri: env.apiUrl,
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      // MyAccount has no id — it is always the current user's account
      MyAccount: { keyFields: [] },
      UserSettings: { keyFields: [] },
    },
  }),
  link: ApolloLink.from([authErrorLink, authLink, httpLink]),
})
