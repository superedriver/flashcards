import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { confirmDestructiveAction } from '@/features/decks/utils/confirm-destructive'
import { useActiveDeckPreviewQuery, useCancelDeckPreviewMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'

export function ActiveDeckPreviewBanner() {
  const { t } = useTranslation()
  const router = useRouter()
  const { data, loading, refetch } = useActiveDeckPreviewQuery({
    fetchPolicy: 'network-only',
    pollInterval: 15_000,
  })
  const [cancelPreview, { loading: cancelling }] = useCancelDeckPreviewMutation({
    refetchQueries: ['ActiveDeckPreview'],
  })

  const session = data?.activeDeckPreview

  if (loading || !session) {
    return null
  }

  const readyCount = session.cards.filter((card) => card.back.trim().length > 0).length

  return (
    <View
      style={{
        backgroundColor: '#fff8e1',
        borderColor: '#ffe082',
        borderRadius: 8,
        borderWidth: 1,
        gap: 8,
        marginBottom: 16,
        padding: 12,
      }}
    >
      <AppText style={{ fontWeight: '700' }}>{t('studyLanguages.preview.resumeTitle')}</AppText>
      <AppText style={{ color: '#666666' }}>
        {t('studyLanguages.preview.resumeMessage', {
          ready: readyCount,
          total: session.cards.length,
        })}
      </AppText>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <AppButton flex={1} onPress={() => router.push(`/preview/${session.id}`)}>
          {t('studyLanguages.preview.continue')}
        </AppButton>
        <AppButton
          disabled={cancelling}
          flex={1}
          onPress={() => {
            confirmDestructiveAction(
              t('studyLanguages.preview.discardTitle'),
              t('studyLanguages.preview.discardMessage'),
              () => {
                void (async () => {
                  await cancelPreview({ variables: { sessionId: session.id } })
                  await refetch()
                })()
              },
            )
          }}
        >
          {t('studyLanguages.preview.discard')}
        </AppButton>
      </View>
    </View>
  )
}
