class CardsController < ApplicationController

  protect_from_forgery with: :null_session
  before_filter :find_card, only: [:show, :edit, :update, :destroy]

  def index
    @cards = Card.all
  end

  def show
  end

  def new
    @card = Card.new
  end

  def create
    @card = Card.new(card_params)
    @card.save

    if @card.errors.empty?
      redirect_to card_path(@card)
    else
      render "new"
    end
  end

  def edit
  end

  def update
    @card.update(card_params)

    if @card.errors.empty?
      redirect_to card_path(@card)
    else
      render "edit"
    end
  end

  def destroy
    @card.destroy
    redirect_to action: "index"
  end

  private

  def card_params
    params.require(:card).permit(:original_text, :translated_text)
  end

  def find_card
    @card = Card.find(params[:id])
    unless @card
      render text: "Page not found", status: 404
    end
  end
end
