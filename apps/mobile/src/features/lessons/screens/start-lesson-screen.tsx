import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { deckNeedsLanguageAssignment } from '@/features/decks/utils/deck-language-gate'
import { useActiveLesson } from '@/features/lessons/hooks/use-active-lesson'
import { mapGraphQlLessonCard } from '@/features/lessons/utils/map-lesson-card'
import { useDeckQuery, useStartLessonMutation } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { LoadingState, PageTitle, Screen } from '@/ui/components'
import { buttonA11yProps } from '@/ui/utils/accessibility'

type StartLessonScreenProps = {
  deckId?: string
}

const EMPTY_MAX_WIDTH = 480

export function StartLessonScreen({ deckId }: StartLessonScreenProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { setActiveLesson } = useActiveLesson()
  const [startLesson] = useStartLessonMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isEmptyLesson, setIsEmptyLesson] = useState(false)
  const [isStarting, setIsStarting] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const hasStartedRef = useRef(false)

  const deckQuery = useDeckQuery({
    skip: !deckId,
    variables: { id: deckId ?? '' },
  })

  useEffect(() => {
    if (!deckId || hasStartedRef.current || deckQuery.loading) {
      return
    }

    const deck = deckQuery.data?.deck

    if (!deck) {
      if (deckQuery.error) {
        setErrorMessage(toStartErrorMessage(deckQuery.error, t('lessons.start.startError')))
        setIsStarting(false)
      }
      return
    }

    if (deckNeedsLanguageAssignment(deck)) {
      hasStartedRef.current = true
      setIsStarting(false)
      router.replace(`/decks/${deckId}/assign-languages`)
      return
    }

    hasStartedRef.current = true

    void startLesson({
      variables: {
        input: { deckId },
      },
    })
      .then((result) => {
        const payload = result.data?.startLesson

        if (!payload) {
          setErrorMessage(t('lessons.start.startError'))
          return
        }

        if (!payload.sessionId || payload.cards.length === 0) {
          setIsEmptyLesson(true)
          return
        }

        const cards = payload.cards.map(mapGraphQlLessonCard)

        setActiveLesson({
          cards,
          currentIndex: 0,
          deckId: payload.deckId ?? null,
          lessonSize: payload.lessonSize,
          reviewedCardIds: [],
          scope: payload.scope,
          sessionId: payload.sessionId,
        })

        router.replace(
          `/lessons/${payload.sessionId}${payload.deckId ? `?deckId=${payload.deckId}` : ''}`,
        )
      })
      .catch((error) => {
        setErrorMessage(toStartErrorMessage(error, t('lessons.start.startError')))
      })
      .finally(() => {
        setIsStarting(false)
      })
  }, [
    deckId,
    deckQuery.data?.deck,
    deckQuery.error,
    deckQuery.loading,
    retryCount,
    router,
    setActiveLesson,
    startLesson,
    t,
  ])

  const handleRetry = () => {
    setErrorMessage(null)
    setIsEmptyLesson(false)
    setIsStarting(true)
    hasStartedRef.current = false
    setRetryCount((current) => current + 1)
  }

  if (!deckId) {
    return (
      <Screen>
        <View style={{ alignSelf: 'center', maxWidth: EMPTY_MAX_WIDTH, width: '100%' }}>
          <View style={{ alignItems: 'center', marginBottom: 36, marginTop: 28 }}>
            <Ionicons color="#b42318" name="alert-circle" size={40} />
            <AppText
              accessibilityRole="header"
              style={{
                fontSize: 24,
                fontWeight: '700',
                marginTop: 16,
                textAlign: 'center',
              }}
            >
              {t('lessons.start.errorTitle')}
            </AppText>
            <AppText
              style={{
                color: '#667085',
                fontSize: 15,
                marginTop: 6,
                textAlign: 'center',
              }}
            >
              {t('lessons.start.deckIdMissing')}
            </AppText>
          </View>
          <Pressable
            {...buttonA11yProps(t('lessons.start.allDecks'))}
            onPress={() => router.replace('/(tabs)/decks')}
            style={{
              alignItems: 'center',
              backgroundColor: '#1a56db',
              borderRadius: 10,
              paddingVertical: 12,
            }}
          >
            <AppText style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
              {t('lessons.start.allDecks')}
            </AppText>
          </Pressable>
        </View>
      </Screen>
    )
  }

  if (isEmptyLesson) {
    return (
      <Screen>
        <View style={{ alignSelf: 'center', maxWidth: EMPTY_MAX_WIDTH, width: '100%' }}>
          <View style={{ alignItems: 'center', marginBottom: 36, marginTop: 28 }}>
            <Ionicons color="#166534" name="checkmark-circle" size={40} />
            <AppText
              accessibilityRole="header"
              style={{
                fontSize: 24,
                fontWeight: '700',
                marginTop: 16,
                textAlign: 'center',
              }}
            >
              {t('lessons.start.emptyTitle')}
            </AppText>
            <AppText
              style={{
                color: '#667085',
                fontSize: 15,
                marginTop: 6,
                textAlign: 'center',
              }}
            >
              {t('lessons.start.emptyLead')}
            </AppText>
            <AppText
              style={{
                color: '#98a2b3',
                fontSize: 13,
                marginTop: 14,
                textAlign: 'center',
              }}
            >
              {t('lessons.start.empty')}
            </AppText>
          </View>
          <View style={{ gap: 4 }}>
            <Pressable
              {...buttonA11yProps(t('lessons.start.backToDeck'))}
              onPress={() => router.replace(`/decks/${deckId}`)}
              style={{
                alignItems: 'center',
                backgroundColor: '#1a56db',
                borderRadius: 10,
                paddingVertical: 12,
              }}
            >
              <AppText style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
                {t('lessons.start.backToDeck')}
              </AppText>
            </Pressable>
            <Pressable
              {...buttonA11yProps(t('lessons.start.allDecks'))}
              onPress={() => router.replace('/(tabs)/decks')}
              style={{ alignItems: 'center', paddingVertical: 6 }}
            >
              <AppText style={{ color: '#667085', fontSize: 14 }}>
                {t('lessons.start.allDecks')}
              </AppText>
            </Pressable>
          </View>
        </View>
      </Screen>
    )
  }

  if (errorMessage) {
    return (
      <Screen>
        <View style={{ alignSelf: 'center', maxWidth: EMPTY_MAX_WIDTH, width: '100%' }}>
          <View style={{ alignItems: 'center', marginBottom: 36, marginTop: 28 }}>
            <Ionicons color="#b42318" name="alert-circle" size={40} />
            <AppText
              accessibilityRole="header"
              style={{
                fontSize: 24,
                fontWeight: '700',
                marginTop: 16,
                textAlign: 'center',
              }}
            >
              {t('lessons.start.errorTitle')}
            </AppText>
            <AppText
              style={{
                color: '#667085',
                fontSize: 15,
                marginTop: 6,
                textAlign: 'center',
              }}
            >
              {errorMessage}
            </AppText>
          </View>
          <View style={{ gap: 4 }}>
            <Pressable
              {...buttonA11yProps(t('common.retry'))}
              onPress={handleRetry}
              style={{
                alignItems: 'center',
                backgroundColor: '#1a56db',
                borderRadius: 10,
                paddingVertical: 12,
              }}
            >
              <AppText style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
                {t('common.retry')}
              </AppText>
            </Pressable>
            <Pressable
              {...buttonA11yProps(t('lessons.start.backToDeck'))}
              onPress={() => router.replace(`/decks/${deckId}`)}
              style={{ alignItems: 'center', paddingVertical: 6 }}
            >
              <AppText style={{ color: '#667085', fontSize: 14 }}>
                {t('lessons.start.backToDeck')}
              </AppText>
            </Pressable>
          </View>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <PageTitle title={t('lessons.start.title')} />
      {isStarting || deckQuery.loading ? (
        <LoadingState message={t('lessons.start.preparing')} />
      ) : null}
    </Screen>
  )
}

function toStartErrorMessage(error: unknown, fallback: string): string {
  const message = getGraphqlErrorMessage(error, fallback)

  return message === 'Internal server error' ? fallback : message
}
