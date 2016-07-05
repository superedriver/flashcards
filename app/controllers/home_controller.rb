class HomeController < ApplicationController
  skip_before_action :require_login, only: [:index, :change_locale]

  def index
    if current_user
      @card = current_user.get_card
    end
  end

  def change_locale
    I18n.locale = params[:locale]
    redirect_to(:back)
  end
end
