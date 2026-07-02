import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

const tamaguiConfig = createTamagui(defaultConfig)

export type AppConfig = typeof tamaguiConfig

declare module 'tamagui' {
  // Tamagui requires an interface extension for typed design tokens.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig
