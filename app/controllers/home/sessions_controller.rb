module Home
  class SessionsController < MainController
    def new
      @user = User.new
    end

    def create
      if @user = login(params[:email].downcase, params[:password])
        redirect_back_or_to root_path, success: t('flashes.login.success')
      else
        flash.now[:error] = t('flashes.login.failed')
        render action: 'new'
      end
    end
  end
end
