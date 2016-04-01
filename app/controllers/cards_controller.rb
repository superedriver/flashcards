class CardsController < ApplicationController
  before_action :find_card, only: [:show, :edit, :update, :destroy, :check]

  def index
    @cards = current_user.cards
  end

  def show
  end

  def new
    @card = Card.new
  end

  def create
    @card = current_user.cards.new(card_params)

    if @card.save
      redirect_to card_path(@card), flash: { success: I18n.t('flashes.cards.success.created') }
    else
      render "new"
    end
  end

  def edit
  end

  def update
    if @card.update(card_params)
      redirect_to card_path(@card),  flash: { success: I18n.t('flashes.cards.success.updated') }
    else
      render "edit"
    end
  end

  def destroy
    @card.destroy
    redirect_to cards_path, flash: { success: I18n.t('flashes.cards.success.deleted') }
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
    params.require(:card).permit(:original_text, :translated_text, :user_id, :image, :remove_image)
  end

  def find_card
    @card = current_user.cards.find_by(id: params[:id])
    unless @card
      render text: "Page not found", status: 404
    end
  end
end
