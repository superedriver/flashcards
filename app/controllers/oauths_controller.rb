# app/controllers/oauths_controller.rb
class OauthsController < ApplicationController
  skip_before_filter :require_login

  # sends the user on a trip to the provider,
  # and after authorizing there back to the callback url.
  def oauth
      session[:return_to_url] = request.referer unless request.referer =~ /oauth/
      login_at(params[:provider])
  end

  def callback

    provider = params[:provider]

    if logged_in?
      puts "0000000000000000000000000000000000"
      puts current_user.inspect
      if @user = add_provider_to_user(provider)
        puts "111111111111111111111111111111111111111111"
        puts @user.inspect
        flash[:notice] = "Logged in using #{provider.titleize}!"
        redirect_to root_path
      else
        puts "222222222222222222222222222222222222222222"
        flash[:error] = "You have already logged from #{provider.titleize}!"
        redirect_to root_path
      end
    else
      puts "333333333333333333333333333333333333333333"
      if @user = login_from(provider)
        puts "4444444444444444444444444444444444444444"
        flash[:notice] = "Logged in from #{provider.titleize}!"
        redirect_to root_path
      else
        puts "55555555555555555555555555555555555555555555555555"
        begin
          puts "66666666666666666666666666666666666666666666666666"
          @user = create_from(provider)

          # NOTE: this is the place to add '@user.activate!' if you are using user_activation submodule

          # reset_session clears session[:return_to_url], so calculate the redirect first
          flash[:notice] = "Logged in from #{provider.titleize}!"
          redirect_to root_path

          reset_session # protect from session fixation attack
          auto_login(@user)
        rescue
          puts "77777777777777777777777777777777777777777777777777"
          flash[:error] = "Failed to login from #{provider.titleize}!"
          redirect_back_or_to root_path
        end
      end
    end
  end
end