class Card < ActiveRecord::Base
  include CheckTranslation

  belongs_to :deck

  validates :original_text, :translated_text, :review_date, presence: true
  validates :deck_id, presence: true

  validate :check_difference

  before_validation :set_review_date!, on: :create
  before_validation :set_current_step!, on: :create
  before_validation :set_attempts_count!, on: :create

  scope :actual_cards, -> { where("review_date <= ?", Time.now) }
  scope :random_card, -> { order("RANDOM()").first }

  mount_uploader :image, ImageUploader

  def check_translation?(inputed_text)
    original_text.mb_chars.downcase == inputed_text.mb_chars.downcase
  end

  def set_review_date!
    self[:review_date] = Time.now
  end

  def set_current_step!
    self[:current_step] = 0
  end

  def set_attempts_count!
    self[:attempts_count] = 0
  end

  private

  def check_difference
    errors.add(I18n.t("errors.validation.description.the_same_value"),
                I18n.t("errors.validation.messages.the_same_value")) if
        original_text.present? && translated_text.present? && (original_text.mb_chars.downcase == translated_text.mb_chars.downcase)
  end
end
