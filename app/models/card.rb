class Card < ActiveRecord::Base
  belongs_to :user

  validates :original_text, :translated_text, :review_date, presence: { message: I18n.t('error.validation.messages.cant_be_blank') }
  validates :user_id, presence: true

  validate :check_difference

  before_validation(on: :create) do
    set_review_date!
  end

  scope :actual_cards, -> { where("review_date <= ?", Date.current) }
  scope :random_card, -> { order("RANDOM()").first }

  mount_uploader :image, ImageUploader

  def check_translation?(inputed_text)
    original_text.mb_chars.downcase == inputed_text.mb_chars.downcase
  end

  def change_review_date!
    update_column(:review_date, 3.days.from_now.to_date)
  end

  def set_review_date!
    self[:review_date] ||= 3.days.from_now.to_date
  end

  private

  def check_difference
    errors.add(I18n.t("errors.validation.description.the_same_value"),
                I18n.t("errors.validation.messages.the_same_value")) if
        original_text.present? && translated_text.present? && (original_text.mb_chars.downcase == translated_text.mb_chars.downcase)
  end
end
