import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Pressable, TextInput, View } from 'react-native'

import { confirmDestructiveAction } from '@/features/decks/utils/confirm-destructive'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import {
  countMissingBacks,
  countMissingExamples,
  countPreviewReadyCards,
} from '@/features/study-languages/utils/deck-preview-utils'
import {
  DeckPreviewSessionStatus,
  useActiveDeckPreviewQuery,
  useCancelDeckPreviewMutation,
  useConfirmDeckPreviewMutation,
  useUpdateDeckPreviewCardMutation,
} from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function DeckPreviewSessionScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editBack, setEditBack] = useState('')
  const [editExample, setEditExample] = useState('')

  const { data, loading, refetch } = useActiveDeckPreviewQuery({
    fetchPolicy: 'network-only',
    pollInterval: 5_000,
  })

  const [updateCard, { loading: updating }] = useUpdateDeckPreviewCardMutation()
  const [confirmPreview, { loading: confirming }] = useConfirmDeckPreviewMutation({
    refetchQueries: ['ActiveDeckPreview', 'MyDecks', 'DecksPage'],
  })
  const [cancelPreview, { loading: cancelling }] = useCancelDeckPreviewMutation({
    refetchQueries: ['ActiveDeckPreview'],
  })

  const session = data?.activeDeckPreview
  const isMatchingSession = session?.id === sessionId

  useEffect(() => {
    if (!loading && data && !isMatchingSession) {
      setErrorMessage(t('studyLanguages.preview.sessionMissing'))
    }
  }, [data, isMatchingSession, loading, t])

  const summary = useMemo(() => {
    if (!session) {
      return null
    }

    return {
      ready: countPreviewReadyCards(session),
      missingBack: countMissingBacks(session),
      missingExample: countMissingExamples(session),
      total: session.cards.length,
    }
  }, [session])

  if (loading && !session) {
    return (
      <Screen>
        <PageTitle title={t('studyLanguages.preview.title')} />
        <LoadingState message={t('studyLanguages.preview.loading')} />
      </Screen>
    )
  }

  if (!session || !isMatchingSession || !summary) {
    return (
      <Screen>
        <PageTitle title={t('studyLanguages.preview.title')} />
        <ErrorState
          message={errorMessage ?? t('studyLanguages.preview.sessionMissing')}
          onRetry={() => void refetch()}
        />
        <AppButton onPress={() => router.replace('/(tabs)/decks')}>
          {t('studyLanguages.preview.backToDecks')}
        </AppButton>
      </Screen>
    )
  }

  const isGenerating = session.status === DeckPreviewSessionStatus.Generating
  const isBusy = updating || confirming || cancelling

  return (
    <Screen>
      <PageTitle title={t('studyLanguages.preview.title')} />
      <FlatList
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        data={session.cards}
        keyExtractor={(item, index) => item.sourceCardId ?? `${index}`}
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 8 }}>
            <AppText style={{ color: '#666666' }}>
              {isGenerating
                ? t('studyLanguages.preview.progress', {
                    ready: summary.ready,
                    total: summary.total,
                  })
                : t('studyLanguages.preview.summary', {
                    missingBack: summary.missingBack,
                    missingExample: summary.missingExample,
                    total: summary.total,
                  })}
            </AppText>
            {errorMessage ? <ErrorState message={errorMessage} /> : null}
            {!isGenerating ? (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <AppButton
                  disabled={isBusy}
                  flex={1}
                  onPress={() => {
                    void (async () => {
                      setErrorMessage(null)

                      try {
                        const result = await confirmPreview({
                          variables: { sessionId: session.id },
                        })
                        const deckId = result.data?.confirmDeckPreview.deck.id

                        if (!deckId) {
                          setErrorMessage(t('studyLanguages.preview.confirmError'))
                          return
                        }

                        router.replace(`/decks/${deckId}`)
                      } catch (error) {
                        setErrorMessage(
                          getGraphqlErrorMessage(error, t('studyLanguages.preview.confirmError')),
                        )
                      }
                    })()
                  }}
                >
                  {confirming
                    ? t('studyLanguages.preview.confirming')
                    : t('studyLanguages.preview.approve')}
                </AppButton>
                <AppButton
                  disabled={isBusy}
                  flex={1}
                  onPress={() => {
                    confirmDestructiveAction(
                      t('studyLanguages.preview.discardTitle'),
                      t('studyLanguages.preview.discardMessage'),
                      () => {
                        void (async () => {
                          try {
                            await cancelPreview({ variables: { sessionId: session.id } })
                            router.replace('/(tabs)/decks')
                          } catch (error) {
                            setErrorMessage(
                              getGraphqlErrorMessage(
                                error,
                                t('studyLanguages.preview.cancelError'),
                              ),
                            )
                          }
                        })()
                      },
                    )
                  }}
                >
                  {t('studyLanguages.preview.cancel')}
                </AppButton>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item, index }) => {
          const isEditing = editingIndex === index

          return (
            <View
              style={{
                borderColor: '#eeeeee',
                borderRadius: 8,
                borderWidth: 1,
                gap: 8,
                padding: 12,
              }}
            >
              <AppText style={{ fontWeight: '700' }}>{item.front}</AppText>
              {isEditing ? (
                <>
                  <TextInput
                    multiline
                    onChangeText={setEditBack}
                    placeholder={t('studyLanguages.preview.backPlaceholder')}
                    style={{
                      borderColor: '#cccccc',
                      borderRadius: 8,
                      borderWidth: 1,
                      minHeight: 60,
                      padding: 8,
                    }}
                    value={editBack}
                  />
                  <TextInput
                    multiline
                    onChangeText={setEditExample}
                    placeholder={t('studyLanguages.preview.examplePlaceholder')}
                    style={{
                      borderColor: '#cccccc',
                      borderRadius: 8,
                      borderWidth: 1,
                      minHeight: 60,
                      padding: 8,
                    }}
                    value={editExample}
                  />
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <AppButton
                      disabled={updating}
                      flex={1}
                      onPress={() => {
                        void (async () => {
                          setErrorMessage(null)

                          try {
                            await updateCard({
                              variables: {
                                input: {
                                  sessionId: session.id,
                                  cardIndex: index,
                                  back: editBack,
                                  example: editExample.trim().length > 0 ? editExample : null,
                                },
                              },
                            })
                            setEditingIndex(null)
                            await refetch()
                          } catch (error) {
                            setErrorMessage(
                              getGraphqlErrorMessage(
                                error,
                                t('studyLanguages.preview.updateError'),
                              ),
                            )
                          }
                        })()
                      }}
                    >
                      {t('common.save')}
                    </AppButton>
                    <AppButton flex={1} onPress={() => setEditingIndex(null)}>
                      {t('common.cancel')}
                    </AppButton>
                  </View>
                </>
              ) : (
                <>
                  <AppText>
                    {t('studyLanguages.preview.backLabel')}: {item.back || '—'}
                  </AppText>
                  <AppText>
                    {t('studyLanguages.preview.exampleLabel')}: {item.example || '—'}
                  </AppText>
                  {item.backError ? (
                    <AppText style={{ color: '#c62828' }}>{item.backError}</AppText>
                  ) : null}
                  {item.exampleError ? (
                    <AppText style={{ color: '#c62828' }}>{item.exampleError}</AppText>
                  ) : null}
                  {!isGenerating ? (
                    <Pressable
                      onPress={() => {
                        setEditingIndex(index)
                        setEditBack(item.back)
                        setEditExample(item.example ?? '')
                      }}
                    >
                      <AppText style={{ color: '#1976d2', fontWeight: '600' }}>
                        {t('studyLanguages.preview.editCard')}
                      </AppText>
                    </Pressable>
                  ) : null}
                </>
              )}
            </View>
          )
        }}
      />
    </Screen>
  )
}
