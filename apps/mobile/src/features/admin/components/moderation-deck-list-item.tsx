import { useTranslation } from 'react-i18next'

import type { ModerationQueueQuery } from '@/graphql/generated'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { DeckStatusBadge } from '@/features/decks/components/deck-status-badge'
import { AppButton, AppCard, AppText } from '@/ui/primitives'

type ModerationDeckListItemProps = {
  deck: ModerationQueueQuery['moderationQueue']['items'][number]
  isSubmitting?: boolean
  onApprove?: (deckId: string) => void
  onHide?: (deckId: string) => void
  onReject?: (deckId: string) => void
  onToggleOfficial?: (deckId: string, isOfficial: boolean) => void
}

export function ModerationDeckListItem({
  deck,
  isSubmitting = false,
  onApprove,
  onHide,
  onReject,
  onToggleOfficial,
}: ModerationDeckListItemProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  return (
    <AppCard style={{ gap: 8, marginBottom: 12, padding: 16 }}>
      <AppText style={{ fontSize: 18, fontWeight: '600' }}>{deck.title}</AppText>
      <AppText style={{ color: '#666666' }}>
        {t('admin.moderation.owner', { email: deck.ownerEmail })}
      </AppText>
      <AppText>{t('admin.moderation.cards', { count: deck.cardCount })}</AppText>
      {deck.isOfficial ? (
        <AppText style={{ color: '#1565c0', fontWeight: '600' }}>
          {t('admin.moderation.officialDeck')}
        </AppText>
      ) : null}
      <DeckStatusBadge moderationStatus={deck.moderationStatus} visibility={deck.visibility} />

      {onApprove ? (
        <AppButton
          background="#2e7d32"
          color="white"
          disabled={isSubmitting}
          onPress={() => onApprove(deck.id)}
        >
          {isSubmitting ? t('admin.moderation.working') : t('admin.moderation.approve')}
        </AppButton>
      ) : null}
      {onReject ? (
        <AppButton
          accessibilityHint={t('admin.moderation.rejectA11yHint')}
          accessibilityLabel={t('admin.moderation.rejectA11yLabel')}
          background="#c62828"
          color="white"
          disabled={isSubmitting}
          onPress={() => onReject(deck.id)}
        >
          {isSubmitting ? t('admin.moderation.working') : t('admin.moderation.reject')}
        </AppButton>
      ) : null}
      {onHide ? (
        <AppButton disabled={isSubmitting} onPress={() => onHide(deck.id)}>
          {isSubmitting ? t('admin.moderation.working') : t('admin.moderation.hide')}
        </AppButton>
      ) : null}

      {isAdmin && onToggleOfficial ? (
        <AppButton
          disabled={isSubmitting}
          onPress={() => onToggleOfficial(deck.id, !deck.isOfficial)}
        >
          {isSubmitting
            ? t('admin.moderation.working')
            : deck.isOfficial
              ? t('admin.moderation.removeOfficial')
              : t('admin.moderation.markOfficial')}
        </AppButton>
      ) : null}
    </AppCard>
  )
}
