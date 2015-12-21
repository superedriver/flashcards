class CardsController < ApplicationController
  def index
    @cards = Card.all
  end

  def show
    @card = Card.find_by id: params[:id]

    if @card
      render "cards/show"
    else
      render text: "Page not found", status: 404
    end
  end
end
