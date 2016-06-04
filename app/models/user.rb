class User < ActiveRecord::Base
  has_many :decks, dependent: :destroy
  has_many :cards, through: :decks
  has_many :authentications, dependent: :destroy

  before_save { self.email = email.downcase }

  email_regex = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i

  validates :password, length: { minimum: 3 }, if: -> { new_record? || changes["password"] }
  validates :password, confirmation: true, if: -> { new_record? || changes["password"] }
  validates :password_confirmation, presence: true, if: -> { new_record? || changes["password"] }
  validates :email, presence: true,
                    uniqueness: { case_sensitive: false },
                    format: { with: email_regex }

  authenticates_with_sorcery! do |config|
    config.authentications_class = Authentication
  end

  def get_card
    get_active_deck_cards.actual_cards.random_card
  end

  def get_active_deck_cards
    deck = decks.actual_deck.first
    deck.present? ? deck.cards : cards
  end

  def self.notify_active_cards
    User.joins(:cards).merge(Card.actual_cards).uniq.each do |user|
      CardsMailer.pending_cards(user).deliver_now
    end
  end

  accepts_nested_attributes_for :authentications
end
