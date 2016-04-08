class CardsController < ApplicationController
  before_action :find_deck, only: [:index, :new, :create, :edit]
  before_action :find_card, only: [:show, :edit, :update, :destroy, :check]

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
    redirect_to deck_cards_path(@card.deck), flash: { success: I18n.t('flashes.cards.success.deleted') }
  end

  def check
    if @card.check_translation?(params[:card][:original_text].mb_chars.downcase)
      flash[:success] = I18n.t("compare_result.right")
      @card.change_review_date!
    else
      flash[:error] = I18n.t("compare_result.not_right", text: params[:original_text].mb_chars.upcase )
    end

    redirect_to root_path
  end

  private

  def card_params
    params.require(:card).permit(:original_text, :translated_text, :deck_id, :image, :remove_image)
  end

  def find_card
    @deck = Deck.find_by(id: params["deck_id"])
    @card = @deck.cards.find_by(id: params[:id])
    unless @card
      render text: "Card not found", status: 404
    end
  end

  def find_deck
    @deck = Deck.find_by(id: params["deck_id"])
    unless @deck
      render text: "Deck not found", status: 404
    end
  end
end
