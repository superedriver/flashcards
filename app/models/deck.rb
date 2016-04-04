class Deck < ActiveRecord::Base
  has_many :cards, dependent: :destroy
  belongs_to :user

  validates :name, :user_id, presence: true

  def set_not_current!
    self.update_column(:current, false)
  end

  def set_current!
    # self.user.decks.each{ |deck| deck.current = false } if self.user.decks.any?
    self.user.decks.each{ |deck| deck.update_column(:current, false) } if self.user.decks.any?
    # update_column(:review_date, 3.days.from_now.to_date)
    self.update_column(:current, true)
  end
end