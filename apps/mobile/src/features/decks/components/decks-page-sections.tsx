import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { DecksPageQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { EmptyState } from '@/ui/components'
import { responsiveGridStyle } from '@/ui/utils/responsive'

import { DeckListItem, type DeckCardSection } from './deck-list-item'

type DecksPageDeck = DecksPageQuery['decksPage']['ownDecks'][number]

type DeckSectionProps = {
  decks: DecksPageDeck[]
  emptyMessage: string
  emptyActionLabel?: string
  onEmptyAction?: () => void
  section: DeckCardSection
  title: string
}

export function DeckSection({
  decks,
  emptyActionLabel,
  emptyMessage,
  onEmptyAction,
  section,
  title,
}: DeckSectionProps) {
  return (
    <View style={{ marginBottom: 24 }}>
      <AppText style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>{title}</AppText>
      {decks.length === 0 ? (
        <EmptyState
          actionLabel={emptyActionLabel}
          message={emptyMessage}
          onAction={onEmptyAction}
        />
      ) : (
        <View style={responsiveGridStyle}>
          {decks.map((deck) => (
            <DeckListItem key={deck.id} deck={deck} section={section} />
          ))}
        </View>
      )}
    </View>
  )
}

type DecksPageSectionsProps = {
  listHeader?: ReactElement | null
  onCreateDeck?: () => void
  page: DecksPageQuery['decksPage']
}

export function DecksPageSections({ listHeader, onCreateDeck, page }: DecksPageSectionsProps) {
  const { t } = useTranslation()

  return (
    <View>
      {listHeader}
      <DeckSection
        decks={page.ownDecks}
        emptyActionLabel={onCreateDeck ? t('decks.myDecks.emptyAction') : undefined}
        emptyMessage={t('decks.sections.own.empty')}
        section="own"
        title={t('decks.sections.own.title')}
        onEmptyAction={onCreateDeck}
      />
      <DeckSection
        decks={page.groupDecks}
        emptyMessage={t('decks.sections.group.empty')}
        section="group"
        title={t('decks.sections.group.title')}
      />
      <DeckSection
        decks={page.publicDecks}
        emptyMessage={t('decks.sections.public.empty')}
        section="public"
        title={t('decks.sections.public.title')}
      />
      {page.noLanguageDecks.length > 0 ? (
        <DeckSection
          decks={page.noLanguageDecks}
          emptyMessage={t('decks.sections.noLanguage.empty')}
          section="noLanguage"
          title={t('decks.sections.noLanguage.title')}
        />
      ) : null}
    </View>
  )
}
