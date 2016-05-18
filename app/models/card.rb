class Card < ActiveRecord::Base
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

  LAITHER = [0, 12.hours, 3.days, 1.week, 2.weeks, 1.month]

  def check_translation?(inputed_text)
    original_text.mb_chars.downcase == inputed_text.mb_chars.downcase
  end

  def change_review_date!
    update_column(:review_date, Time.now + LAITHER[self[:current_step]])
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

  def correct_answer
    self[:attempts_count] = 0
    self[:current_step] += 1 if self[:current_step] < 5
    self.change_review_date!
  end

  def incorrect_answer
    self[:attempts_count] += 1
    if self[:attempts_count] >= 3
      self[:attempts_count] = 0
      self[:current_step] -= 2
      self[:current_step] = 0 if self[:current_step] < 0
    end

    self.change_review_date!
  end

  private

  def check_difference
    errors.add(I18n.t("errors.validation.description.the_same_value"),
                I18n.t("errors.validation.messages.the_same_value")) if
        original_text.present? && translated_text.present? && (original_text.mb_chars.downcase == translated_text.mb_chars.downcase)
  end
end
