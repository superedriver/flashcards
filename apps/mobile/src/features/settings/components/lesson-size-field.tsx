import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import type { SettingsFormValues } from '@/features/settings/validation/settings-form.schema'
import { AppText } from '@/ui/primitives'

const LESSON_SIZE_MIN = 5
const LESSON_SIZE_MAX = 100

type LessonSizeFieldProps = {
  control: Control<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
  onCommit?: (value: number) => void
}

function clampLessonSize(value: number): number {
  return Math.min(LESSON_SIZE_MAX, Math.max(LESSON_SIZE_MIN, value))
}

export function LessonSizeField({ control, onCommit }: LessonSizeFieldProps) {
  const { t } = useTranslation()

  return (
    <View style={{ gap: 8 }}>
      <AppText style={{ color: '#344054', fontSize: 14, fontWeight: '600' }}>
        {t('settings.fields.lessonSize.label')}
      </AppText>
      <Controller
        control={control}
        name="lessonSize"
        render={({ field: { onChange, value } }) => {
          const size = clampLessonSize(Number(value) || LESSON_SIZE_MIN)

          const step = (delta: number) => {
            const next = clampLessonSize(size + delta)
            onChange(next)
            onCommit?.(next)
          }

          return (
            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
              <Pressable
                accessibilityLabel={t('settings.fields.lessonSize.decrement')}
                accessibilityRole="button"
                disabled={size <= LESSON_SIZE_MIN}
                onPress={() => step(-1)}
                style={{
                  alignItems: 'center',
                  borderColor: '#e4e7ec',
                  borderRadius: 8,
                  borderWidth: 1,
                  height: 36,
                  justifyContent: 'center',
                  opacity: size <= LESSON_SIZE_MIN ? 0.4 : 1,
                  width: 36,
                }}
              >
                <AppText style={{ fontSize: 18, fontWeight: '700' }}>−</AppText>
              </Pressable>
              <AppText
                accessibilityLabel={t('settings.fields.lessonSize.accessibilityLabel')}
                style={{ fontSize: 18, fontWeight: '700', minWidth: 48, textAlign: 'center' }}
              >
                {size}
              </AppText>
              <Pressable
                accessibilityLabel={t('settings.fields.lessonSize.increment')}
                accessibilityRole="button"
                disabled={size >= LESSON_SIZE_MAX}
                onPress={() => step(1)}
                style={{
                  alignItems: 'center',
                  borderColor: '#e4e7ec',
                  borderRadius: 8,
                  borderWidth: 1,
                  height: 36,
                  justifyContent: 'center',
                  opacity: size >= LESSON_SIZE_MAX ? 0.4 : 1,
                  width: 36,
                }}
              >
                <AppText style={{ fontSize: 18, fontWeight: '700' }}>+</AppText>
              </Pressable>
            </View>
          )
        }}
      />
    </View>
  )
}
