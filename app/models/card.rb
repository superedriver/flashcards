class Card < ActiveRecord::Base
  validates :original_text, :translated_text, :review_date, presence: { message: I18n.t('error.validation.messages.cant_be_blank') }

  validate :check_difference

  before_validation(on: :create) do
    self[:review_date] = Date.current + 3.days
  end

  scope :actual_cards, -> { where("review_date <= ?", Date.current) }
  scope :random_card, -> { order("RANDOM()").first }

  def check_translation?(input_text)
    original_text.mb_chars.downcase == input_text
  end

  def change_review_date!
    self.update_column(:review_date, Date.current + 3.day)
  end

  private

  def check_difference
    errors.add(I18n.t("error.validation.description.the_same_value"),
                I18n.t("error.validation.messages.the_same_value")) if
        original_text.present? && translated_text.present? && (original_text.mb_chars.downcase == translated_text.mb_chars.downcase)
  end

end
