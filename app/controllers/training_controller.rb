class TrainingController < ApplicationController
  before_action :find_card, only: [:check]
  def check
    result = CheckTranslation.new(@card).check_translation?(params[:card][:original_text])
    if result.success?
      flash[:success] = result.message
    else
      flash[:error]  = result.message
    end
    redirect_to root_path
  end

  private

  def find_card
    @deck = Deck.find_by(id: params["deck_id"])
    @card = @deck.cards.find_by(id: params[:id])

    unless @card
      render text: "Card not found", status: 404
    end
  end
end
