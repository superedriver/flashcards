class HomeController < ApplicationController
  def index
    @card = Card.where("user_id = ?", current_user.id).actual_cards.random_card
  end
end
