import { gql } from '@apollo/client'

import { apolloClient } from '@/graphql/apollo-client'

import { applyLocaleFromBackend } from './bootstrap-locale'
import { type AppLocale } from './types'

const ACCOUNT_LOCALE_QUERY = gql`
  query AccountLocale {
    myAccount {
      settings {
        interfaceLocale
      }
    }
  }
`

type AccountLocaleQueryResult = {
  myAccount?: {
    settings?: {
      interfaceLocale?: string | null
    } | null
  } | null
}

export async function syncLocaleFromBackend(): Promise<AppLocale | null> {
  try {
    const result = await apolloClient.query<AccountLocaleQueryResult>({
      query: ACCOUNT_LOCALE_QUERY,
      fetchPolicy: 'network-only',
    })

    const interfaceLocale = result.data.myAccount?.settings?.interfaceLocale

    if (!interfaceLocale) {
      return null
    }

    return applyLocaleFromBackend(interfaceLocale)
  } catch {
    return null
  }
}
