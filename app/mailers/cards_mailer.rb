class CardsMailer < ApplicationMailer
  default from: "noreply@flashcards.com"

  def pending_cards(user)
    @user = user
    mail to: "superedriver@gmail.com", subject: "Hi! You have active cards."
  end
end
