import 'react-native-reanimated'

import { Stack } from 'expo-router'

import { TamaguiAppProvider } from '@/ui/tamagui-provider'

export default function RootLayout() {
  return (
    <TamaguiAppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </TamaguiAppProvider>
  )
}
