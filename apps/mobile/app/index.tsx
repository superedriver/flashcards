import { Redirect } from 'expo-router'

import { useAuthGate } from '@/features/auth/hooks/use-auth-gate'
import { LoadingState, Screen } from '@/ui/components'

export default function IndexScreen() {
  const gate = useAuthGate('publicRoot')

  if (gate.status === 'loading') {
    return (
      <Screen>
        <LoadingState message="Loading session..." />
      </Screen>
    )
  }

  if (gate.status === 'redirect') {
    return <Redirect href={gate.href} />
  }

  return null
}
