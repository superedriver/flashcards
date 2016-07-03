class RegistrationsController < ApplicationController
  skip_before_action :require_login, only: [:new, :create]

  def new
    @user = User.new
  end

  def create
    # binding.pry
    @user = User.new(user_params)
    @user[:locale] = params[:locale]
    if @user.save
      login(params[:user][:email].downcase, params[:user][:password])
      redirect_to root_path, flash: { success: I18n.t('flashes.registration.success') }
    else
      render 'new'
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :locale)
  end
end
