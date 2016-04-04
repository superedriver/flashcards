class SessionsController < ApplicationController
  skip_before_action :require_login, except: [:destroy]

  def new
    @user = User.new
  end

  def create
    if @user = login(params[:email].downcase, params[:password])
      redirect_back_or_to root_path, success: I18n.t('flashes.login.success')
    else
      flash.now[:error] = I18n.t('flashes.login.failed')
      render action: 'new'
    end
  end

  def destroy
    logout
    redirect_to root_path
  end
end
