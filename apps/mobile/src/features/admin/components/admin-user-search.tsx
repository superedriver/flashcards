import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AppInput, AppText } from '@/ui/primitives'

type AdminUserSearchProps = {
  onQueryChange: (query: string) => void
  value: string
}

export function AdminUserSearch({ onQueryChange, value }: AdminUserSearchProps) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      onQueryChange(inputValue.trim())
    }, 300)

    return () => clearTimeout(timeout)
  }, [inputValue, onQueryChange])

  return (
    <>
      <AppText style={{ fontWeight: '600' }}>{t('admin.users.searchLabel')}</AppText>
      <AppInput
        autoCapitalize="none"
        placeholder={t('admin.users.searchPlaceholder')}
        value={inputValue}
        onChangeText={setInputValue}
      />
    </>
  )
}
