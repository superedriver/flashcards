class HomeController < ApplicationController
  def index
    @card = current_user.get_card
  end
end
