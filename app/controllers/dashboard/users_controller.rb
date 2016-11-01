module Dashboard
  class UsersController < MainController
    before_action :find_user, only: [:edit, :update, :show]

    def show
    end

    def edit
    end

    def update
      if @user.update(user_params)
        redirect_to users_path,  flash: { success: t('flashes.users.success.updated') }
      else
        render 'edit'
      end
    end

    private
    def user_params
      params.require(:user).permit(:email, :password, :locale, :remind_email)
    end

    def find_user
      @user = current_user
    end
  end
end

