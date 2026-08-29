import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, PanResponder, Pressable, View, useWindowDimensions } from 'react-native'

import type { PromptDirection } from '@/features/lessons/types/active-lesson'
import { ReviewAnswer } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { buttonA11yProps } from '@/ui/utils/accessibility'
import { getLessonCardContainerStyle } from '@/ui/utils/responsive'

const FLIP_MS = 200
const EXIT_MS = 200
const SWIPE_THRESHOLD_PX = 80
const SWIPE_VELOCITY = 0.45

export type ReviewFlashcardHandle = {
  playExit: (answer: ReviewAnswer) => void
}

export type ReviewFlashcardProps = {
  back: string
  cardId: string
  example?: string | null
  front: string
  isExiting?: boolean
  isRevealed: boolean
  notes?: string | null
  onAnswer: (answer: ReviewAnswer) => void
  onExitStart: () => void
  onReveal: () => void
  promptDirection: PromptDirection
}

export const ReviewFlashcard = forwardRef<ReviewFlashcardHandle, ReviewFlashcardProps>(
  function ReviewFlashcard(
    {
      back,
      cardId,
      example,
      front,
      isExiting = false,
      isRevealed,
      notes,
      onAnswer,
      onExitStart,
      onReveal,
      promptDirection,
    },
    ref,
  ) {
    const { t } = useTranslation()
    const { width } = useWindowDimensions()
    const containerStyle = getLessonCardContainerStyle(width)
    const translateX = useRef(new Animated.Value(0)).current
    const scaleX = useRef(new Animated.Value(1)).current
    const isFlippingRef = useRef(false)
    const isExitingRef = useRef(false)
    const isRevealedRef = useRef(isRevealed)
    const wasExitingRef = useRef(isExiting)
    const onAnswerRef = useRef(onAnswer)
    const onExitStartRef = useRef(onExitStart)
    const onRevealRef = useRef(onReveal)

    isRevealedRef.current = isRevealed
    onAnswerRef.current = onAnswer
    onExitStartRef.current = onExitStart
    onRevealRef.current = onReveal

    const isBackToFront = promptDirection === 'BACK_TO_FRONT'
    const promptText = isBackToFront ? back : front
    const answerText = isBackToFront ? front : back
    const promptLabel = isBackToFront ? t('lessons.flashcard.back') : t('lessons.flashcard.front')
    const answerLabel = isBackToFront ? t('lessons.flashcard.front') : t('lessons.flashcard.back')

    const resetPosition = useCallback(() => {
      translateX.stopAnimation()
      scaleX.stopAnimation()
      translateX.setValue(0)
      scaleX.setValue(1)
      isFlippingRef.current = false
      isExitingRef.current = false
    }, [scaleX, translateX])

    useEffect(() => {
      resetPosition()
    }, [cardId, promptDirection, resetPosition])

    useEffect(() => {
      if (wasExitingRef.current && !isExiting) {
        isExitingRef.current = false
        Animated.timing(translateX, {
          duration: EXIT_MS,
          toValue: 0,
          useNativeDriver: true,
        }).start()
      }

      wasExitingRef.current = isExiting
    }, [isExiting, translateX])

    const playExit = useCallback(
      (answer: ReviewAnswer) => {
        if (!isRevealedRef.current || isExitingRef.current || isFlippingRef.current) {
          return
        }

        isExitingRef.current = true
        onExitStartRef.current()

        const destination = answer === ReviewAnswer.Know ? width : -width

        Animated.timing(translateX, {
          duration: EXIT_MS,
          toValue: destination,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            onAnswerRef.current(answer)
            return
          }

          isExitingRef.current = false
        })
      },
      [translateX, width],
    )

    useImperativeHandle(ref, () => ({ playExit }), [playExit])

    const handleFlip = useCallback(() => {
      if (isRevealedRef.current || isFlippingRef.current || isExitingRef.current) {
        return
      }

      isFlippingRef.current = true

      Animated.timing(scaleX, {
        duration: FLIP_MS / 2,
        toValue: 0.02,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) {
          isFlippingRef.current = false
          return
        }

        onRevealRef.current()

        Animated.timing(scaleX, {
          duration: FLIP_MS / 2,
          toValue: 1,
          useNativeDriver: true,
        }).start(() => {
          isFlippingRef.current = false
        })
      })
    }, [scaleX])

    const panResponder = useMemo(
      () =>
        PanResponder.create({
          onMoveShouldSetPanResponder: (_event, gesture) =>
            isRevealedRef.current &&
            !isExitingRef.current &&
            !isFlippingRef.current &&
            Math.abs(gesture.dx) > 12 &&
            Math.abs(gesture.dx) > Math.abs(gesture.dy),
          onPanResponderTerminationRequest: () => false,
          onPanResponderMove: (_event, gesture) => {
            translateX.setValue(gesture.dx)
          },
          onPanResponderRelease: (_event, gesture) => {
            if (!isRevealedRef.current || isExitingRef.current) {
              return
            }

            const swipedRight = gesture.dx > SWIPE_THRESHOLD_PX || gesture.vx > SWIPE_VELOCITY
            const swipedLeft = gesture.dx < -SWIPE_THRESHOLD_PX || gesture.vx < -SWIPE_VELOCITY

            if (swipedRight) {
              playExit(ReviewAnswer.Know)
              return
            }

            if (swipedLeft) {
              playExit(ReviewAnswer.DontKnow)
              return
            }

            Animated.spring(translateX, {
              friction: 7,
              toValue: 0,
              useNativeDriver: true,
            }).start()
          },
        }),
      [playExit, translateX],
    )

    const rotate = translateX.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ['-8deg', '0deg', '8deg'],
    })
    const knowTintOpacity = translateX.interpolate({
      inputRange: [0, 120],
      outputRange: [0, 0.22],
      extrapolate: 'clamp',
    })
    const dontKnowTintOpacity = translateX.interpolate({
      inputRange: [-120, 0],
      outputRange: [0.22, 0],
      extrapolate: 'clamp',
    })

    return (
      <View style={containerStyle}>
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            backgroundColor: '#ffffff',
            borderColor: '#e4e7ec',
            borderRadius: 16,
            borderWidth: 1,
            minHeight: 300,
            transform: [{ translateX }, { rotate }, { scaleX }],
          }}
        >
          <Pressable
            {...(!isRevealed
              ? buttonA11yProps(
                  t('lessons.flashcard.tapToReveal'),
                  t('lessons.flashcard.revealHint'),
                )
              : {})}
            disabled={isRevealed || isExiting}
            onPress={handleFlip}
            pointerEvents={isRevealed ? 'none' : 'auto'}
            style={{
              flex: 1,
              gap: 16,
              justifyContent: 'center',
              minHeight: 300,
              overflow: 'hidden',
              padding: 24,
            }}
          >
            <Animated.View
              pointerEvents="none"
              style={{
                backgroundColor: '#2e7d32',
                borderRadius: 16,
                bottom: 0,
                left: 0,
                opacity: knowTintOpacity,
                position: 'absolute',
                right: 0,
                top: 0,
              }}
            />
            <Animated.View
              pointerEvents="none"
              style={{
                backgroundColor: '#c62828',
                borderRadius: 16,
                bottom: 0,
                left: 0,
                opacity: dontKnowTintOpacity,
                position: 'absolute',
                right: 0,
                top: 0,
              }}
            />
            <AppText
              style={{
                color: '#667085',
                fontSize: 12,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}
            >
              {promptLabel}
            </AppText>
            <AppText
              style={{ fontSize: 28, fontWeight: '700', lineHeight: 36, textAlign: 'center' }}
            >
              {promptText}
            </AppText>

            {!isRevealed ? (
              <AppText style={{ color: '#667085', fontSize: 14, textAlign: 'center' }}>
                {t('lessons.flashcard.tapToReveal')}
              </AppText>
            ) : (
              <View style={{ gap: 12 }}>
                <AppText
                  style={{
                    color: '#667085',
                    fontSize: 12,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                  }}
                >
                  {answerLabel}
                </AppText>
                <AppText style={{ fontSize: 24, lineHeight: 32, textAlign: 'center' }}>
                  {answerText}
                </AppText>
                {example ? (
                  <AppText style={{ color: '#667085', fontSize: 16, textAlign: 'center' }}>
                    {t('lessons.flashcard.example', { text: example })}
                  </AppText>
                ) : null}
                {notes ? (
                  <AppText style={{ color: '#667085', fontSize: 14, textAlign: 'center' }}>
                    {t('lessons.flashcard.notes', { text: notes })}
                  </AppText>
                ) : null}
              </View>
            )}
          </Pressable>
        </Animated.View>
      </View>
    )
  },
)
