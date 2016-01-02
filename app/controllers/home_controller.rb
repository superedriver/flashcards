class HomeController < ApplicationController
  def index
    @card = Card.find(804)
    # cards = Card.where(("review_date <= #{Date.current}"))
    # cards = Card.where("review_date <= ?", Date.current)

    # render text: cards
    # @card = cards[10]
  end

  def check
    # @card = Card.find(params[:id])
    # @card
    if params[:card][:original_text].mb_chars.downcase == params[:original_text].mb_chars.downcase
      @check_result = true
      Card.find(params[:id].to_i).update({})
    else
      @check_result = false
    end
  end

end
