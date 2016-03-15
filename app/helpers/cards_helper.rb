module CardsHelper
  def get_text(field)
    self[field].present? ? self[field] : t('error.messages.empty_field')
  end
end
