import { useTranslation } from 'react-i18next'

import type { GroupSharedDecksQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'
import { AppText } from '@/ui/primitives'

import { GroupSharedDeckListItem } from './group-shared-deck-list-item'

type GroupSharedDeckListProps = {
  decks: GroupSharedDecksQuery['groupSharedDecks']
  onShareDeck?: () => void
}

export function GroupSharedDeckList({ decks, onShareDeck }: GroupSharedDeckListProps) {
  const { t } = useTranslation()

  return (
    <>
      <AppText style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
        {t('groups.sharedDecks.title')}
      </AppText>
      {decks.length === 0 ? (
        <EmptyState
          actionLabel={onShareDeck ? t('groups.sharedDecks.emptyAction') : undefined}
          message={t('groups.sharedDecks.empty')}
          onAction={onShareDeck}
        />
      ) : (
        decks.map((deck) => <GroupSharedDeckListItem key={deck.id} deck={deck} />)
      )}
    </>
  )
}
