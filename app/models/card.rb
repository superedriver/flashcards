class Card < ActiveRecord::Base
  validates :original_text, :translated_text, :review_date, presence: true

  before_save :original_and_translated_texts_are_different

  private
    def original_and_translated_texts_are_different
      self.original_text.downcase != self.translated_text.downcase
    end
end
