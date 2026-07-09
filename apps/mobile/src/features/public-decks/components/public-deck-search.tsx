import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AppInput } from '@/ui/primitives'

type PublicDeckSearchProps = {
  onSearchChange: (query: string) => void
  value: string
}

export function PublicDeckSearch({ onSearchChange, value }: PublicDeckSearchProps) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearchChange(draft.trim())
    }, 300)

    return () => clearTimeout(timeout)
  }, [draft, onSearchChange])

  return (
    <AppInput
      placeholder={t('publicDecks.searchPlaceholder')}
      value={draft}
      onChangeText={setDraft}
    />
  )
}
