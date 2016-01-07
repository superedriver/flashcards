class Card < ActiveRecord::Base
  validates :original_text, :translated_text, :review_date, presence: { message: I18n.t('error.validation.messages.cant_be_blank') }

  validate :check_difference

  before_validation :set_review_date

  scope :actual_cards, -> { where("review_date <= ?", Date.current) }
  scope :random_card, -> { order("RANDOM()").first }

  def check_translation?(input_text)
    original_text.mb_chars.downcase == input_text
  end

  private

  def check_difference
    errors.add(I18n.t("error.validation.description.the_same_value"),
                I18n.t("error.validation.messages.the_same_value")) if
        original_text.present? && translated_text.present? && original_text.downcase == translated_text.downcase
  end

  def set_review_date
    self.review_date = Date.current + 3.days
  end
end
