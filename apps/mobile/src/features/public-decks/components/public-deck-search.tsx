import { useEffect, useState } from 'react'

import { AppInput } from '@/ui/primitives'

type PublicDeckSearchProps = {
  onSearchChange: (query: string) => void
  value: string
}

export function PublicDeckSearch({ onSearchChange, value }: PublicDeckSearchProps) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(draft.trim())
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [draft, onSearchChange])

  return <AppInput placeholder="Search public decks" value={draft} onChangeText={setDraft} />
}
