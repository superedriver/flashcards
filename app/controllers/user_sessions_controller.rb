class UserSessionsController < ApplicationController
  skip_before_action :require_login, except: [:destroy]

  def new
    @user = User.new
  end

  def create
    if @user = login(params[:email].downcase, params[:password])
      redirect_back_or_to(root_path, success: 'Glad to see you again!')
    else
      flash[:error] = 'Incorrect login or password!'
      render action: 'new'
    end
  end

  def destroy
    logout
    redirect_to root_path
  end
end
