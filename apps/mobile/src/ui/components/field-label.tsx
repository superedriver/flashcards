import { AppText } from '@/ui/primitives'

type FieldLabelProps = {
  children: string
}

export function FieldLabel({ children }: FieldLabelProps) {
  return (
    <AppText accessibilityRole="text" style={{ fontWeight: '600', marginBottom: 4 }}>
      {children}
    </AppText>
  )
}
