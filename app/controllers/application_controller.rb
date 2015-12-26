class ApplicationController < ActionController::Base
  rescue_from ActiveRecord::RecordInvalid, with: :show_errors
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  protected

  def show_errors(exception)
    render xml: exception, status: 404
  end
end
