module CardsHelper
  def get_text(card, field)
    return (card.review_date.present? ? (l card.review_date, format: :default) : t('error.messages.empty_field')) if field == :review_date
    card[field].present? ? card[field] : t('error.messages.empty_field')
  end
end
