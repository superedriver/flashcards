import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Platform } from 'react-native'

import { clearAuthSession } from '@/features/auth/services/auth-session'
import { apolloClient } from '@/graphql/apollo-client'
import { useDeleteAccountMutation } from '@/graphql/generated'
import { i18n } from '@/i18n'

function confirmStep(
  title: string,
  message: string,
  confirmLabel: string,
  destructive: boolean,
): Promise<boolean> {
  return new Promise((resolve) => {
    if (Platform.OS === 'web') {
      resolve(globalThis.confirm(`${title}\n\n${message}`))
      return
    }

    Alert.alert(
      title,
      message,
      [
        { onPress: () => resolve(false), style: 'cancel', text: i18n.t('common.cancel') },
        {
          onPress: () => resolve(true),
          style: destructive ? 'destructive' : 'default',
          text: confirmLabel,
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    )
  })
}

function showAccountDeletedAlert(message: string): Promise<void> {
  return new Promise((resolve) => {
    if (Platform.OS === 'web') {
      globalThis.alert(message)
      resolve()
      return
    }

    Alert.alert(message, undefined, [{ onPress: () => resolve(), text: i18n.t('common.ok') }])
  })
}

export function useDeleteAccount() {
  const { t } = useTranslation()
  const router = useRouter()
  const [deleteAccountMutation, { loading }] = useDeleteAccountMutation()
  const [error, setError] = useState<string | null>(null)

  const requestDelete = useCallback(async () => {
    const firstConfirmed = await confirmStep(
      t('profile.deleteAccountConfirmTitle'),
      t('profile.deleteAccountConfirmMessage'),
      t('profile.deleteAccountContinue'),
      false,
    )

    if (!firstConfirmed) {
      return
    }

    const secondConfirmed = await confirmStep(
      t('profile.deleteAccountPermanentTitle'),
      t('profile.deleteAccountPermanentMessage'),
      t('profile.deleteAccountPermanentAction'),
      true,
    )

    if (!secondConfirmed) {
      return
    }

    setError(null)

    try {
      const result = await deleteAccountMutation()

      if (!result.data?.deleteAccount) {
        setError(t('profile.deleteAccountError'))
        return
      }

      await showAccountDeletedAlert(t('profile.accountDeleted'))
      await clearAuthSession()
      await apolloClient.clearStore()
      router.replace('/(auth)/sign-in')
    } catch {
      setError(t('profile.deleteAccountError'))
    }
  }, [deleteAccountMutation, router, t])

  return { error, loading, requestDelete }
}
