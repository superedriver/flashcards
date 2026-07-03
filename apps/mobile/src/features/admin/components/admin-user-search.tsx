import { useEffect, useState } from 'react'

import { AppInput } from '@/ui/primitives'

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
    <AppInput
      autoCapitalize="none"
      placeholder="Search users by email"
      value={inputValue}
      onChangeText={setInputValue}
    />
  )
}
