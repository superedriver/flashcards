import { Ionicons } from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  View,
  useWindowDimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { confirmDestructiveAction } from '@/features/decks/utils/confirm-destructive'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { LanguageListRow } from '@/features/study-languages/components/language-list-row'
import { useStudyLanguageContext } from '@/features/study-languages/hooks/use-study-language-context'
import {
  useRemoveStudyLanguageMutation,
  useStudyLanguageRemovalImpactLazyQuery,
} from '@/graphql/generated'
import { AppText } from '@/ui/primitives'

type StudyLanguagesListModalProps = {
  onClose: () => void
  visible: boolean
}

export function StudyLanguagesListModal({ onClose, visible }: StudyLanguagesListModalProps) {
  const { t } = useTranslation()
  const { height } = useWindowDimensions()
  const { studyLanguages, setActiveTargetLanguage, settingActive, refetch } =
    useStudyLanguageContext()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [removingCode, setRemovingCode] = useState<string | null>(null)

  const [fetchImpact] = useStudyLanguageRemovalImpactLazyQuery()
  const [removeStudyLanguage] = useRemoveStudyLanguageMutation({
    refetchQueries: ['MyStudyLanguages', 'StudyLanguageBootstrap'],
  })

  const ordered = useMemo(() => {
    const active = studyLanguages.filter((item) => item.isActive)
    const rest = studyLanguages
      .filter((item) => !item.isActive)
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return [...active, ...rest]
  }, [studyLanguages])

  async function handleSelect(languageCode: string, isActive: boolean) {
    if (isActive) {
      onClose()
      return
    }

    setErrorMessage(null)

    try {
      await setActiveTargetLanguage(languageCode)
      onClose()
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, t('studyLanguages.studyList.setActiveError')))
    }
  }

  async function handleRemove(languageCode: string) {
    setErrorMessage(null)

    try {
      const impactResult = await fetchImpact({
        variables: { languageCode },
        fetchPolicy: 'network-only',
      })
      const affectedDeckCount = impactResult.data?.studyLanguageRemovalImpact.affectedDeckCount ?? 0

      const message =
        affectedDeckCount > 0
          ? t('studyLanguages.studyList.removeConfirmMessage', { count: affectedDeckCount })
          : t('studyLanguages.studyList.removeConfirmMessageZero')

      confirmDestructiveAction(t('studyLanguages.studyList.removeConfirmTitle'), message, () => {
        void (async () => {
          setRemovingCode(languageCode)

          try {
            await removeStudyLanguage({ variables: { languageCode } })
            await refetch()
          } catch (error) {
            setErrorMessage(
              getGraphqlErrorMessage(error, t('studyLanguages.studyList.removeError')),
            )
          } finally {
            setRemovingCode(null)
          }
        })()
      })
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, t('studyLanguages.studyList.removeError')))
    }
  }

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', flex: 1, justifyContent: 'flex-end' }}>
        <SafeAreaView
          edges={['bottom']}
          style={{
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: height * 0.75,
            minHeight: height * 0.4,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              borderBottomColor: '#eeeeee',
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <AppText style={{ fontSize: 18, fontWeight: '700' }}>
              {t('studyLanguages.studyList.title')}
            </AppText>
            <Pressable
              accessibilityLabel={t('common.close')}
              accessibilityRole="button"
              hitSlop={8}
              onPress={onClose}
            >
              <Ionicons color="#666666" name="close" size={24} />
            </Pressable>
          </View>

          {errorMessage ? (
            <AppText style={{ color: '#c62828', marginHorizontal: 16, marginTop: 12 }}>
              {errorMessage}
            </AppText>
          ) : null}

          {ordered.length === 0 ? (
            <AppText style={{ color: '#666666', padding: 16 }}>
              {t('studyLanguages.studyList.empty')}
            </AppText>
          ) : (
            <FlatList
              data={ordered}
              keyExtractor={(item) => item.languageCode}
              renderItem={({ item }) => (
                <LanguageListRow
                  disabled={settingActive || removingCode === item.languageCode}
                  language={item.language}
                  onPress={() => void handleSelect(item.languageCode, item.isActive)}
                  selected={item.isActive}
                  rightAccessory={
                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                      {item.isActive ? (
                        <AppText style={{ color: '#1976d2', fontSize: 12, fontWeight: '700' }}>
                          {t('studyLanguages.studyList.active')}
                        </AppText>
                      ) : null}
                      <Pressable
                        accessibilityRole="button"
                        disabled={removingCode === item.languageCode}
                        hitSlop={8}
                        onPress={() => void handleRemove(item.languageCode)}
                      >
                        {removingCode === item.languageCode ? (
                          <ActivityIndicator size="small" />
                        ) : (
                          <AppText style={{ color: '#c62828', fontSize: 13, fontWeight: '600' }}>
                            {t('studyLanguages.studyList.remove')}
                          </AppText>
                        )}
                      </Pressable>
                    </View>
                  }
                />
              )}
            />
          )}
        </SafeAreaView>
      </View>
    </Modal>
  )
}
