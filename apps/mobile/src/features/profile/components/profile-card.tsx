import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import type { ProfileMeQuery } from '@/graphql/generated'
import { formatDate } from '@/i18n/formatters'
import { AppText } from '@/ui/primitives'

type ProfileCardProps = {
  user: NonNullable<ProfileMeQuery['me']>
}

function getRoleKey(role: string): 'admin' | 'moderator' | 'user' {
  const normalized = role.toUpperCase()

  if (normalized === 'ADMIN') {
    return 'admin'
  }

  if (normalized === 'MODERATOR') {
    return 'moderator'
  }

  return 'user'
}

export function ProfileCard({ user }: ProfileCardProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const roleKey = getRoleKey(user.role)
  const isVerified = Boolean(user.emailVerifiedAt)
  const isBlocked = Boolean(user.blockedAt)
  const showRole = roleKey !== 'user'

  return (
    <View
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#e4e7ec',
        borderRadius: 12,
        borderWidth: 1,
        gap: 6,
        padding: 12,
      }}
    >
      <AppText style={{ fontSize: 16, fontWeight: '700' }}>{user.email}</AppText>
      <AppText
        style={{ color: isVerified ? '#166534' : '#b54708', fontSize: 14, fontWeight: '600' }}
      >
        {isVerified
          ? t('profile.accountStatus.emailVerifiedWithMark')
          : t('profile.accountStatus.emailNotVerified')}
      </AppText>
      {!isVerified ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(auth)/verify-email-prompt')}
        >
          <AppText style={{ color: '#1a56db', fontSize: 14, fontWeight: '600' }}>
            {t('profile.accountStatus.resendVerification')}
          </AppText>
        </Pressable>
      ) : null}
      <AppText style={{ color: '#667085', fontSize: 13 }}>
        {t('profile.memberSince', { date: formatDate(user.createdAt) })}
      </AppText>
      {showRole ? (
        <AppText style={{ color: '#667085', fontSize: 13 }}>
          {t('profile.role', { role: t(`profile.roles.${roleKey}`) })}
        </AppText>
      ) : null}
      {isBlocked ? (
        <AppText style={{ color: '#b42318', fontSize: 13, fontWeight: '600' }}>
          {t('profile.accountStatus.blocked')}
        </AppText>
      ) : null}
    </View>
  )
}
