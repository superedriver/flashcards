import '@/providers/load-reanimated'

import { Stack } from 'expo-router'

import { AppProviders } from '@/providers/app-providers'

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lessons" />
        <Stack.Screen name="admin" />
      </Stack>
    </AppProviders>
  )
}
