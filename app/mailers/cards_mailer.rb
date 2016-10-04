class CardsMailer < ApplicationMailer
  default from: "noreply@flashcards.com"

  def pending_cards(user)
    @user = user
    mail to: @user.email, subject: "Hi! You have active cards."
  end
end
