import { Ionicons } from '@expo/vector-icons'
import { View } from 'react-native'

const ICONS: Array<{
  backgroundColor: string
  color: string
  name: keyof typeof Ionicons.glyphMap
}> = [
  { backgroundColor: '#dbeafe', color: '#1a56db', name: 'book-outline' },
  { backgroundColor: '#dcfce7', color: '#166534', name: 'school-outline' },
  { backgroundColor: '#ede9fe', color: '#6d28d9', name: 'people-outline' },
  { backgroundColor: '#fef3c7', color: '#92400e', name: 'globe-outline' },
  { backgroundColor: '#fee2e2', color: '#b91c1c', name: 'briefcase-outline' },
]

function hashName(value: string): number {
  let hash = 0

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  }

  return hash
}

type GroupRowIconProps = {
  name: string
}

export function GroupRowIcon({ name }: GroupRowIconProps) {
  const icon = ICONS[hashName(name) % ICONS.length] ?? {
    backgroundColor: '#dbeafe',
    color: '#1a56db',
    name: 'book-outline' as const,
  }

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: icon.backgroundColor,
        borderRadius: 10,
        height: 40,
        justifyContent: 'center',
        width: 40,
      }}
    >
      <Ionicons color={icon.color} name={icon.name} size={20} />
    </View>
  )
}
