class Deck < ActiveRecord::Base
  has_many :cards, dependent: :destroy
  belongs_to :user

  validates :name, :user_id, presence: true

  scope :actual_deck, -> { where("current = ?", true) }

  def set_not_current!
    update_column(:current, false)
  end

  def set_current!
    user.decks.update_all(current: false) if self.user.decks.any?
    update_column(:current, true)
  end
end
