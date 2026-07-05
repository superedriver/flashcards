import { Platform, type ViewStyle } from 'react-native'

export const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
} as const

export const CONTENT_MAX_WIDTH = {
  narrow: 420,
  default: 720,
  wide: 960,
} as const

export const LESSON_CARD_MAX_WIDTH = 640

export type ScreenVariant = keyof typeof CONTENT_MAX_WIDTH

export function getContentMaxWidth(variant: ScreenVariant): number {
  return CONTENT_MAX_WIDTH[variant]
}

export function getScreenPadding(windowWidth: number): number {
  if (windowWidth < 480) {
    return 16
  }

  if (windowWidth < BREAKPOINTS.tablet) {
    return 20
  }

  return 24
}

export function getScreenContentContainerStyle(
  windowWidth: number,
  variant: ScreenVariant = 'default',
): ViewStyle {
  if (Platform.OS !== 'web') {
    return { width: '100%' }
  }

  const maxWidth = getContentMaxWidth(variant)

  return {
    alignSelf: 'center',
    maxWidth: Math.min(maxWidth, windowWidth),
    width: '100%',
  }
}

export function getListNumColumns(windowWidth: number): number {
  if (Platform.OS !== 'web') {
    return 1
  }

  if (windowWidth >= BREAKPOINTS.desktop) {
    return 2
  }

  if (windowWidth >= BREAKPOINTS.tablet) {
    return 2
  }

  return 1
}

export function getLessonCardContainerStyle(windowWidth: number): ViewStyle {
  if (Platform.OS !== 'web') {
    return { width: '100%' }
  }

  return {
    alignSelf: 'center',
    maxWidth: Math.min(LESSON_CARD_MAX_WIDTH, windowWidth - 32),
    width: '100%',
  }
}

export const buttonRowStyle: ViewStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
}

export const responsiveGridStyle: ViewStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
}

export const responsiveGridItemStyle: ViewStyle = {
  flexBasis: '45%',
  flexGrow: 1,
  minWidth: 140,
}
