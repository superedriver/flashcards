import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Pressable, View } from 'react-native'

import type { DeckCardsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { buttonA11yProps } from '@/ui/utils/accessibility'

import { CardListItem } from './card-list-item'

type CardListProps = {
  cards: DeckCardsQuery['deckCards']
  deckId: string
  isOwner: boolean
  listHeader?: ReactElement | null
  onAddCard?: () => void
  onDeleteCard?: (cardId: string) => void
  sectionTitle?: string
}

export function CardList({
  cards,
  deckId,
  isOwner,
  listHeader,
  onAddCard,
  onDeleteCard,
  sectionTitle,
}: CardListProps) {
  const { t } = useTranslation()

  const sectionHeader = sectionTitle ? (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'space-between',
        marginBottom: 12,
        marginTop: 4,
      }}
    >
      <View
        style={{
          alignItems: 'baseline',
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          minWidth: 0,
        }}
      >
        <AppText style={{ fontSize: 18, fontWeight: '700' }}>{sectionTitle}</AppText>
        <AppText style={{ color: '#667085', fontSize: 14, fontWeight: '600' }}>
          {t('decks.header.cardCount', { count: cards.length })}
        </AppText>
      </View>
      {isOwner && onAddCard ? (
        <Pressable
          {...buttonA11yProps(t('decks.deckDetail.addCard'))}
          onPress={onAddCard}
          style={{ paddingVertical: 4 }}
        >
          <AppText style={{ color: '#1a56db', fontSize: 15, fontWeight: '700' }}>
            {t('decks.deckDetail.addCardAction')}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  ) : null

  const header =
    listHeader || sectionHeader ? (
      <>
        {listHeader}
        {sectionHeader}
      </>
    ) : undefined

  return (
    <FlatList
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 16, paddingRight: 16 }}
      data={cards}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={{ alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 28 }}>
          <AppText style={{ fontSize: 28 }}>📇</AppText>
          <AppText style={{ color: '#101828', fontSize: 16, fontWeight: '700' }}>
            {t('decks.card.emptyTitle')}
          </AppText>
          {isOwner ? (
            <AppText style={{ color: '#667085', fontSize: 14, textAlign: 'center' }}>
              {t('decks.card.emptyHint')}
            </AppText>
          ) : null}
        </View>
      }
      ListHeaderComponent={header}
      renderItem={({ item, index }) => (
        <CardListItem
          card={item}
          deckId={deckId}
          isOwner={isOwner}
          isOdd={index % 2 === 1}
          onDelete={onDeleteCard}
        />
      )}
      style={{ flex: 1 }}
    />
  )
}
