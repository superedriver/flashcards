class CardsMailer < ApplicationMailer
  def pending_cards(user)
    @user = user
    @url  = 'http://example.com/login'
    mail(to: @user.email, subject: 'Hi! You have active cards.')
  end
end
