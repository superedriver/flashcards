import { useEffect, useState } from 'react'

import { AppInput, AppText } from '@/ui/primitives'

type AdminUserSearchProps = {
  onQueryChange: (query: string) => void
  value: string
}

export function AdminUserSearch({ onQueryChange, value }: AdminUserSearchProps) {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      onQueryChange(inputValue.trim())
    }, 300)

    return () => clearTimeout(timeout)
  }, [inputValue, onQueryChange])

  return (
    <>
      <AppText style={{ fontWeight: '600' }}>Search users</AppText>
      <AppInput
        autoCapitalize="none"
        placeholder="Search by email"
        value={inputValue}
        onChangeText={setInputValue}
      />
    </>
  )
}
