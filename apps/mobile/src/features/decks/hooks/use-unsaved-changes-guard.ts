import { useNavigation } from 'expo-router'
import { useEffect, useRef } from 'react'
import { Platform } from 'react-native'

import { confirmAction } from '@/features/decks/utils/confirm-destructive'

type NavigationLeaveEvent = {
  data: { action: object }
  preventDefault: () => void
}

export function useUnsavedChangesGuard(
  shouldBlock: boolean,
  title: string,
  message: string,
  onLeaveConfirmed?: () => void,
): {
  allowLeave: () => void
  resetLeaveGuard: () => void
} {
  const navigation = useNavigation()
  const skipRef = useRef(false)
  const shouldBlockRef = useRef(shouldBlock)
  const onLeaveConfirmedRef = useRef(onLeaveConfirmed)
  shouldBlockRef.current = shouldBlock
  onLeaveConfirmedRef.current = onLeaveConfirmed

  const allowLeave = () => {
    skipRef.current = true
  }

  const resetLeaveGuard = () => {
    skipRef.current = false
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event: NavigationLeaveEvent) => {
      if (skipRef.current || !shouldBlockRef.current) {
        return
      }

      event.preventDefault()
      confirmAction(title, message, () => {
        skipRef.current = true
        onLeaveConfirmedRef.current?.()
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
      if (skipRef.current || !shouldBlockRef.current) {
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
