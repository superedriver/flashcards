import { useNavigation, usePathname } from 'expo-router'
import { useLayoutEffect } from 'react'

export function useLessonsTabBar() {
  const navigation = useNavigation()
  const pathname = usePathname()
  const showTabBar = /\/summary\/?$/.test(pathname)

  useLayoutEffect(() => {
    const tabNavigation = navigation.getParent() ?? navigation

    tabNavigation.setOptions({
      tabBarStyle: showTabBar ? undefined : { display: 'none' },
    })

    return () => {
      tabNavigation.setOptions({ tabBarStyle: undefined })
    }
  }, [navigation, showTabBar])
}
