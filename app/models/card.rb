class Card < ActiveRecord::Base
  validates :original_text, :translated_text, :review_date, presence: { message: I18n.t('error.validation.messages.cant_be_blank') }

  validate :check_difference

  before_validation :set_review_date

  private

  def check_difference
    errors.add( I18n.t('error.messages.error') ,I18n.t('error.validation.messages.the_same_value')) if
        original_text.downcase.present? && translated_text.downcase.present? && original_text.downcase == translated_text.downcase
  end

  def set_review_date
    self.review_date = DateTime.now.utc.to_date + 3.days
  end
end
