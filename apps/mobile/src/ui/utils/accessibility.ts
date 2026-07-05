import type { AccessibilityRole } from 'react-native'

type AccessibilityProps = {
  accessibilityHint?: string
  accessibilityLabel: string
  accessibilityRole?: AccessibilityRole
}

export function buttonA11yProps(label: string, hint?: string): AccessibilityProps {
  return {
    accessibilityHint: hint,
    accessibilityLabel: label,
    accessibilityRole: 'button',
  }
}

export function destructiveButtonA11yProps(label: string, hint?: string): AccessibilityProps {
  return {
    accessibilityHint: hint ?? 'Destructive action.',
    accessibilityLabel: `${label}. Destructive action.`,
    accessibilityRole: 'button',
  }
}

export function textFieldA11yProps(label: string, hint?: string): AccessibilityProps {
  return {
    accessibilityHint: hint,
    accessibilityLabel: label,
    accessibilityRole: 'text',
  }
}
