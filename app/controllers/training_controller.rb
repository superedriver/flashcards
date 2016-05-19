class TrainingController < ApplicationController
  before_action :find_card, only: [:check]
  def check
    if @card.check_translation?(params[:card][:original_text].mb_chars.downcase)
      flash[:success] = I18n.t("compare_result.right")
      @card.correct_answer
    else
      flash[:error] = I18n.t("compare_result.not_right", text: params[:original_text].mb_chars.upcase )
      @card.incorrect_answer
    end
    @card.update(card_params)
    redirect_to root_path
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

  def find_card
    @deck = Deck.find_by(id: params["deck_id"])
    @card = @deck.cards.find_by(id: params[:id])

    unless @card
      render text: "Card not found", status: 404
    end
  end
end
