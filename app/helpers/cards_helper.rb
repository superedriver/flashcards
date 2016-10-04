module CardsHelper
  def get_text(card, field)
    return (card.review_date.present? ? (l card.review_date, format: :default) : t('errors.messages.empty_field')) if field == :review_date
    card[field].present? ? card[field] : t('errors.messages.empty_field')
  end
end
