module Home
  class RegistrationsController < MainController
    def new
      @user = User.new
    end

    def create
      locale = I18n.available_locales.include?(I18n.locale) ? I18n.locale : :en
      @user = User.new(user_params.merge(locale: locale, remind_email: true))
      if @user.save
        login(params[:user][:email].downcase, params[:user][:password])
        redirect_to root_path, flash: { success: t('flashes.registration.success') }
      else
        render 'new'
      end
    end

    private
    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation, :locale)
    end
  end
end
