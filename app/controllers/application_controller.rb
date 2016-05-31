class ApplicationController < ActionController::Base
  rescue_from ActiveRecord::RecordInvalid, with: :show_errors
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :require_login

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
