class ApplicationController < ActionController::Base
  rescue_from ActiveRecord::RecordInvalid, with: :show_errors
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :require_login
  before_filter :set_locale

  def set_locale
    locale = if current_user
               current_user.locale
             elsif params[:locale]
               session[:locale] = params[:locale]
             elsif session[:locale]
               session[:locale]
             else
               http_accept_language.compatible_language_from(I18n.available_locales)
             end

    if locale && I18n.available_locales.include?(locale.to_sym)
      session[:locale] = I18n.locale = locale.to_sym
      # binding.pry
    end
  end

  protected

    def show_errors(exception)
      render exception, status: 404
    end

  private

    def not_authenticated
      redirect_to login_path, notice: I18n.t('flashes.login.login_first')
    end

    def find_card
      @deck = Deck.find_by(id: params["deck_id"])
      @card = @deck.cards.find_by(id: params[:id])

      unless @card
        render text: "Card not found", status: 404
      end
    end
end
