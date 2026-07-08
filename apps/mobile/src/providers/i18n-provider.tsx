import { I18nextProvider } from 'react-i18next'
import { useEffect, useState, type ReactNode } from 'react'

import { bootstrapLocale } from '@/i18n/bootstrap-locale'
import i18n from '@/i18n/init'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    void bootstrapLocale().finally(() => {
      if (isMounted) {
        setIsReady(true)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  if (!isReady) {
    return null
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
