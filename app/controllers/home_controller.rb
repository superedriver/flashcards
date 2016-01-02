class HomeController < ApplicationController
  def index
    @card = Card.actual_cards.random_card
  end

  def check
    if params[:card][:original_text].mb_chars.downcase == params[:original_text].mb_chars.downcase
      @check_result = true
      Card.find(params[:id].to_i).update({})
    else
      @check_result = false
    end
  end

end
