import type { ReactNode } from 'react'

import { AuthProvider } from '@/features/auth/components/auth-provider'
import { ApolloAppProvider } from '@/graphql/apollo-provider'
import { I18nProvider } from '@/providers/i18n-provider'
import { TamaguiAppProvider } from '@/ui/tamagui-provider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <TamaguiAppProvider>
        <ApolloAppProvider>
          <AuthProvider>{children}</AuthProvider>
        </ApolloAppProvider>
      </TamaguiAppProvider>
    </I18nProvider>
  )
}
