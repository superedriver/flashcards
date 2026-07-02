import { createAnimations } from '@tamagui/animations-react-native'
import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

const animations = createAnimations({
  fast: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
    type: 'spring',
  },
  medium: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
    type: 'spring',
  },
  slow: {
    damping: 20,
    stiffness: 60,
    type: 'spring',
  },
})

const tamaguiConfig = createTamagui({
  ...defaultConfig,
  animations,
})

export type AppConfig = typeof tamaguiConfig

declare module 'tamagui' {
  // Tamagui requires an interface extension for typed design tokens.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig
