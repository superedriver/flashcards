class CardsController < ApplicationController
  def index
    @cards = Card.all
  end

  def show
    @card = Card.where(id: params[:id]).first
    puts @card
    if @card
      render "cards/show"
    else
      render text: "Page not found", status: 404
    end
  end
end