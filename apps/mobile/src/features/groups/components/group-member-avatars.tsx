import { View } from 'react-native'

import { AppText } from '@/ui/primitives'

const AVATAR_COLORS = [
  { backgroundColor: '#ede9fe', color: '#5b21b6' },
  { backgroundColor: '#dbeafe', color: '#1e40af' },
  { backgroundColor: '#fef3c7', color: '#92400e' },
  { backgroundColor: '#dcfce7', color: '#166534' },
  { backgroundColor: '#fce7f3', color: '#9d174d' },
] as const

type MemberPreview = {
  initials: string
  userId: string
}

type GroupMemberAvatarsProps = {
  extraCount: number
  members: MemberPreview[]
}

function colorForId(userId: string) {
  let hash = 0

  for (const character of userId) {
    hash = (hash + character.charCodeAt(0)) % AVATAR_COLORS.length
  }

  return (
    AVATAR_COLORS[hash] ?? {
      backgroundColor: '#ede9fe',
      color: '#5b21b6',
    }
  )
}

export function GroupMemberAvatars({ extraCount, members }: GroupMemberAvatarsProps) {
  if (members.length === 0 && extraCount <= 0) {
    return null
  }

  return (
    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
      {members.map((member, index) => {
        const colors = colorForId(member.userId)

        return (
          <View
            key={member.userId}
            style={{
              alignItems: 'center',
              backgroundColor: colors.backgroundColor,
              borderColor: '#ffffff',
              borderRadius: 12,
              borderWidth: 2,
              height: 24,
              justifyContent: 'center',
              marginLeft: index === 0 ? 0 : -6,
              width: 24,
              zIndex: members.length - index,
            }}
          >
            <AppText style={{ color: colors.color, fontSize: 10, fontWeight: '700' }}>
              {member.initials}
            </AppText>
          </View>
        )
      })}
      {extraCount > 0 ? (
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#f2f4f7',
            borderColor: '#ffffff',
            borderRadius: 12,
            borderWidth: 2,
            height: 24,
            justifyContent: 'center',
            marginLeft: members.length > 0 ? -6 : 0,
            minWidth: 24,
            paddingHorizontal: 4,
          }}
        >
          <AppText style={{ color: '#667085', fontSize: 9, fontWeight: '700' }}>
            +{extraCount}
          </AppText>
        </View>
      ) : null}
    </View>
  )
}
