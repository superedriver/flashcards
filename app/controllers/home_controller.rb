class HomeController < ApplicationController

  def index
    @card = Card.actual_cards.random_card
  end

end
