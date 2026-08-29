import { useLessonsTabBar } from '@/features/lessons/hooks/use-lessons-tab-bar'
import { StudyLanguageProtectedStack } from '@/features/study-languages/components/study-language-protected-stack'

export default function LessonsLayout() {
  useLessonsTabBar()

  return <StudyLanguageProtectedStack />
}
