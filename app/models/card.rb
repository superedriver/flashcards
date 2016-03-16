class Card < ActiveRecord::Base
  belongs_to :user
  # validates_associated :user

  validates :original_text, :translated_text, :review_date, presence: { message: I18n.t('error.validation.messages.cant_be_blank') }
  validates :user_id, presence: true

  validate :check_difference

  before_validation(on: :create) do
    self[:review_date] = Date.current + 3.days
    # self[:review_date] = Date.current
  end

  scope :actual_cards, -> { where("review_date <= ?", Date.current) }
  scope :random_card, -> { order("RANDOM()").first }

  def check_translation?(inputed_text)
    original_text.mb_chars.downcase == inputed_text.mb_chars.downcase
  end

  def change_review_date!
    update_column(:review_date, Date.current + 3.day)
  end

  private

  def check_difference
    errors.add(I18n.t("error.validation.description.the_same_value"),
                I18n.t("error.validation.messages.the_same_value")) if
        original_text.present? && translated_text.present? && (original_text.mb_chars.downcase == translated_text.mb_chars.downcase)
  end
end
