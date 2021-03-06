module Home
  class OauthsController < MainController
    # sends the user on a trip to the provider,
    # and after authorizing there back to the callback url.
    def oauth
      session[:return_to_url] = request.referer unless request.referer =~ /oauth/
      login_at(auth_params[:provider])
    end

    def callback
      provider = auth_params[:provider]

      if logged_in?
        if @user = add_provider_to_user(provider)
          redirect_to root_path, notice: t('flashes.oauth.login.success', provider: provider.titleize)
        else
          redirect_to root_path, flash: { error: t('flashes.oauth.login.already_logged', provider: provider.titleize)}
        end
      else
        if @user = login_from(provider)
          redirect_to root_path, notice: t('flashes.oauth.login.success', provider: provider.titleize)
        else
          begin
            @user = create_from(provider)
            # NOTE: this is the place to add '@user.activate!' if you are using user_activation submodule

            # reset_session clears session[:return_to_url], so calculate the redirect first

            redirect_to root_path, notice: t('flashes.oauth.login.success', provider: provider.titleize)
            reset_session # protect from session fixation attack
            auto_login(@user)
          rescue
            redirect_back_or_to root_path, flash: { error: t('flashes.oauth.login.failed', provider: provider.titleize)}
          end
        end
      end
    end

    private
    def auth_params
      params.permit(:code, :provider)
    end
  end
end
