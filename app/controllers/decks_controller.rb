class DecksController < ApplicationController
  before_action :find_deck, only: [:show, :edit, :update, :destroy, :activate, :deactivate]

  def index
    @decks = current_user.decks
  end

  def new
    @deck = Deck.new
  end

  def create
    @deck = current_user.decks.new(deck_params)
    if @deck.save
      redirect_to deck_path(@deck), flash: { success: I18n.t('flashes.decks.success.created') }
    else
      render "new"
    end
  end

  def show
  end

  def edit
  end

  def update
    if @deck.update(deck_params)
      redirect_to decks_path,  flash: { success: I18n.t('flashes.decks.success.updated') }
    else
      render "edit"
    end
  end

  def destroy
    @deck.destroy
    redirect_to decks_path, flash: { success: I18n.t('flashes.decks.success.deleted') }
  end

  def activate
    @deck.set_current!
    redirect_to decks_path, flash: { success: I18n.t('flashes.decks.success.activated') }
  end

  def deactivate
    @deck.set_not_current!
    redirect_to decks_path, flash: { success: I18n.t('flashes.decks.success.deactivated') }
  end

  private

  def deck_params
    params.require(:deck).permit(:name, :user_id)
  end

  def find_deck
    @deck = current_user.decks.find_by(id: params[:id])
    unless @deck
      render text: "Page not found", status: 404
    end
  end
end
