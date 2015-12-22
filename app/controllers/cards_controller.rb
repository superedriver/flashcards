class CardsController < ApplicationController

  def index
    @cards = Card.all
  end

  def show
    @card = Card.find_by id: params[:id]

    unless @card
      render text: "Page not found", status: 404
    end
  end

  def new
    @card = Card.new
  end

  def create
    @card = Card.new(card_params)
    @card.review_date = DateTime.now.to_date + 3.days
    @card.save

    if @card.errors.empty?
      redirect_to card_path(@card)
    else
      render "new"
    end
  end

  def edit
    @card = Card.find(params[:id])
  end

  def update
    @card = Card.find(params[:id])
    @card.update_attributes(card_params)
    @card.review_date = DateTime.now.to_date + 3.days
    @card.save

    if @card.errors.empty?
      redirect_to card_path(@card)
    else
      render "edit"
    end
  end

  def destroy
    @card = Card.find(params[:id])
    @card.destroy
    redirect_to action: "index"
  end


  private
  def card_params
    params.require(:card).permit(:original_text, :translated_text)
  end

end
