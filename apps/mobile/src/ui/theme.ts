export const appThemes = {
  light: {
    appBackground: '#ffffff',
    appText: '#111111',
  },
  dark: {
    appBackground: '#111111',
    appText: '#ffffff',
  },
} as const

export type AppThemeName = keyof typeof appThemes
