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

export const REVIEW_CARD_ASPECT_RATIO = 1.58
export const REVIEW_CARD_MIN_HEIGHT = 360
export const REVIEW_CARD_MAX_HEIGHT = 420

export function getReviewCardWidth(windowWidth: number): number {
  const padding = getScreenPadding(windowWidth) * 2
  const innerWidth = Math.max(0, windowWidth - padding)

  if (Platform.OS !== 'web') {
    return innerWidth
  }

  const contentWidth = Math.min(CONTENT_MAX_WIDTH.default, innerWidth)

  return Math.min(LESSON_CARD_MAX_WIDTH, contentWidth)
}

export function getReviewCardHeight(cardWidth: number): number {
  if (cardWidth <= 0) {
    return REVIEW_CARD_MIN_HEIGHT
  }

  return Math.round(
    Math.min(
      REVIEW_CARD_MAX_HEIGHT,
      Math.max(REVIEW_CARD_MIN_HEIGHT, cardWidth / REVIEW_CARD_ASPECT_RATIO),
    ),
  )
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

export const DECK_SECTION_GRID_GAP = 12
const DECK_SECTION_CARD_MIN_WIDTH = 228

export function getDeckSectionColumnCount(windowWidth: number): number {
  const padding = getScreenPadding(windowWidth) * 2
  const innerWidth =
    Platform.OS === 'web'
      ? Math.min(CONTENT_MAX_WIDTH.default, Math.max(0, windowWidth - padding))
      : Math.max(0, windowWidth - padding)

  if (innerWidth >= DECK_SECTION_CARD_MIN_WIDTH * 3 + DECK_SECTION_GRID_GAP * 2) {
    return 3
  }

  if (innerWidth >= DECK_SECTION_CARD_MIN_WIDTH * 2 + DECK_SECTION_GRID_GAP) {
    return 2
  }

  return 1
}

export function getDeckSectionGridStyle(): ViewStyle {
  return {
    alignItems: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DECK_SECTION_GRID_GAP,
    width: '100%',
  }
}

export function getDeckSectionGridItemStyle(windowWidth: number): ViewStyle {
  const columns = getDeckSectionColumnCount(windowWidth)

  if (columns === 1) {
    return { width: '100%' }
  }

  const gapTotal = DECK_SECTION_GRID_GAP * (columns - 1)

  return {
    alignSelf: 'stretch',
    maxWidth: '100%',
    width: `calc((100% - ${gapTotal}px) / ${columns})`,
  } as unknown as ViewStyle
}
