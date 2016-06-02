class CardsMailer < ApplicationMailer
  def pending_cards(user)
    mail(to: user.email, subject: 'Hi! You have active cards.')
  end
end
