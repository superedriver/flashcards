import { useEffect, useState } from 'react'

import {
  useMyStudyLanguagesQuery,
  useSetActiveTargetLanguageMutation,
  useStudyLanguageBootstrapQuery,
} from '@/graphql/generated'

import {
  getPersistedActiveTargetLanguage,
  persistActiveTargetLanguage,
} from '../storage/active-target-language-storage'

export function useStudyLanguageContext() {
  const {
    data: studyLanguagesData,
    loading: studyLanguagesLoading,
    error: studyLanguagesError,
    refetch: refetchStudyLanguages,
  } = useMyStudyLanguagesQuery()

  const {
    data: bootstrapData,
    loading: bootstrapLoading,
    error: bootstrapError,
    refetch: refetchBootstrap,
  } = useStudyLanguageBootstrapQuery()

  const [setActiveTargetLanguageMutation, { loading: settingActive }] =
    useSetActiveTargetLanguageMutation()

  const [persistedActiveTargetLanguage, setPersistedActiveTargetLanguage] = useState<string | null>(
    null,
  )
  const [persistedReady, setPersistedReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    void getPersistedActiveTargetLanguage().then((value) => {
      if (cancelled) {
        return
      }

      setPersistedActiveTargetLanguage(value)
      setPersistedReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const studyLanguages =
    studyLanguagesData?.myStudyLanguages ?? bootstrapData?.myAccount.studyLanguages ?? []

  const activeFromServer =
    studyLanguages.find((item) => item.isActive)?.languageCode ??
    bootstrapData?.myAccount.settings.activeTargetLanguage ??
    null

  const activeTargetLanguage = activeFromServer ?? persistedActiveTargetLanguage

  const activeLanguage =
    studyLanguages.find((item) => item.languageCode === activeTargetLanguage)?.language ?? null

  const nativeLanguage = bootstrapData?.myAccount.settings.nativeLanguage ?? null

  const needsStudyLanguageOnboarding =
    bootstrapData?.myAccount.needsStudyLanguageOnboarding ??
    (studyLanguagesData !== undefined && studyLanguages.length === 0)

  useEffect(() => {
    if (!activeFromServer || activeFromServer === persistedActiveTargetLanguage) {
      return
    }

    void persistActiveTargetLanguage(activeFromServer).then(() => {
      setPersistedActiveTargetLanguage(activeFromServer)
    })
  }, [activeFromServer, persistedActiveTargetLanguage])

  async function setActiveTargetLanguage(languageCode: string) {
    const result = await setActiveTargetLanguageMutation({
      variables: { languageCode },
      refetchQueries: ['MyStudyLanguages', 'StudyLanguageBootstrap'],
    })

    await persistActiveTargetLanguage(languageCode)
    setPersistedActiveTargetLanguage(languageCode)

    return result.data?.setActiveTargetLanguage ?? []
  }

  async function refetch() {
    await Promise.all([refetchStudyLanguages(), refetchBootstrap()])
  }

  return {
    activeLanguage,
    activeTargetLanguage,
    error: studyLanguagesError ?? bootstrapError ?? null,
    loading: studyLanguagesLoading || bootstrapLoading || !persistedReady,
    nativeLanguage,
    needsStudyLanguageOnboarding,
    refetch,
    setActiveTargetLanguage,
    settingActive,
    studyLanguages,
  }
}
