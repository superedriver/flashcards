class HomeController < ApplicationController
  def index
    @card = current_user.cards.actual_cards.random_card
  end
end
