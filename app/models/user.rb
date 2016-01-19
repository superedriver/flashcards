class User < ActiveRecord::Base
  has_many :cards, dependent: :destroy
  # validates_associated :cards
end
