module CardsHelper
  def get_text(card, field)
    return (card.review_date.present? ? (l card.review_date, format: :default) : t('errors.messages.empty_field')) if field == :review_date
    card[field].present? ? card[field] : t('errors.messages.empty_field')
  end
  #
  # def get_url(card, deck)
  #   card.new_record? ? deck_cards_path(deck) : deck_card_path(card.deck, card)
  # end
end
