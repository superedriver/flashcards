class User < ActiveRecord::Base
  has_many :cards, dependent: :destroy
  has_many :authentications, dependent: :destroy

  before_save { self.email = email.downcase }

  validates :password, length: { minimum: 3 }, if: -> { new_record? || changes["password"] }
  validates :password, confirmation: true, if: -> { new_record? || changes["password"] }
  validates :password_confirmation, presence: true, if: -> { new_record? || changes["password"] }
  validates :email, presence: true, uniqueness: { case_sensitive: false }

  authenticates_with_sorcery! do |config|
    config.authentications_class = Authentication
  end

  def get_card
    cards.actual_cards.random_card
  end

  accepts_nested_attributes_for :authentications
end
