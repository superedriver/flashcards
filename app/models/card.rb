class Card < ActiveRecord::Base
  validates :original_text, :translated_text, :review_date, presence: true

  validate :check_difference

  private
    def check_difference
      self.errors.add(:difference, "can't be greater than total value") if
          self.original_text.downcase == self.translated_text.downcase
    end
end
