class TrainingController < ApplicationController
  before_action :find_card, only: [:check]
  def check

    if CheckTranslation.new(@card).check_translation?(params[:card][:original_text])
      flash[:success] = I18n.t("compare_result.right")
    else
      flash[:error] = I18n.t("compare_result.not_right", text: @card[:original_text].mb_chars.upcase )
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
