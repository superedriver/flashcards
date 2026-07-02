import type { ReactNode } from 'react'

import { ApolloAppProvider } from '@/graphql/apollo-provider'
import { TamaguiAppProvider } from '@/ui/tamagui-provider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <TamaguiAppProvider>
      <ApolloAppProvider>{children}</ApolloAppProvider>
    </TamaguiAppProvider>
  )
}
