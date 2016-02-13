class UsersController < ApplicationController

  before_action :find_user, only: [:edit, :update, :show]

  def show
  end

  def edit
  end

  def update
    if @user.update(user_params)
      redirect_to user_path(@user)
    else
      render "edit"
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password)
  end

  def find_user
    @user = User.find_by(id: params[:id])
    unless @user
      render text: "Page not found", status: 404
    end
  end
end
