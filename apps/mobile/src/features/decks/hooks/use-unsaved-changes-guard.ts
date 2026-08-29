import { useNavigation } from 'expo-router'
import { useEffect, useRef } from 'react'
import { Platform } from 'react-native'

import { confirmAction } from '@/features/decks/utils/confirm-destructive'

type NavigationLeaveEvent = {
  data: { action: object }
  preventDefault: () => void
}

export function useUnsavedChangesGuard(
  isDirty: boolean,
  title: string,
  message: string,
): {
  allowLeave: () => void
  resetLeaveGuard: () => void
} {
  const navigation = useNavigation()
  const skipRef = useRef(false)
  const isDirtyRef = useRef(isDirty)
  isDirtyRef.current = isDirty

  const allowLeave = () => {
    skipRef.current = true
  }

  const resetLeaveGuard = () => {
    skipRef.current = false
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event: NavigationLeaveEvent) => {
      if (skipRef.current || !isDirtyRef.current) {
        return
      }

      event.preventDefault()
      confirmAction(title, message, () => {
        skipRef.current = true
        navigation.dispatch(event.data.action as never)
      })
    })

    return unsubscribe
  }, [message, navigation, title])

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return
    }

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (skipRef.current || !isDirtyRef.current) {
        return
      }

      event.preventDefault()
      event.returnValue = ''
    }

    globalThis.addEventListener('beforeunload', onBeforeUnload)

    return () => {
      globalThis.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [])

  return { allowLeave, resetLeaveGuard }
}
