class CardsController < ApplicationController
  before_action :find_deck, only: [:index, :new, :create, :edit, :destroy]
  before_action :find_card, only: [:show, :edit, :update, :destroy]

  def index
    @cards = @deck.cards
  end

  def show
  end

  def new
    @card = Card.new
  end

  def create
    @card = @deck.cards.new(card_params)
    if @card.save
      redirect_to deck_card_path(@card.deck, @card), flash: { success: I18n.t('flashes.cards.success.created') }
    else
      render "new"
    end
  end

  def edit
  end

  def update
    if @card.update(card_params)
      redirect_to deck_card_path(@card.deck, @card),  flash: { success: I18n.t('flashes.cards.success.updated') }
    else
      render "edit"
    end
  end

  def destroy
    @card.destroy
    redirect_to deck_path(@deck), flash: { success: I18n.t('flashes.cards.success.deleted') }
  end

  private

  def card_params
    params.require(:card).permit(
        :original_text,
        :translated_text,
        :review_date,
        :deck_id,
        :image,
        :current_step,
        :remove_image,
        :attempts_count
    )
  end

  def find_deck
    @deck = Deck.find_by(id: params["deck_id"])
    unless @deck
      render text: "Deck not found", status: 404
    end
  end
end
