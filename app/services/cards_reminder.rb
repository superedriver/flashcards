class CardsReminder
  def self.notify_active_cards
    User.joins(:cards).merge(Card.actual_cards).uniq.each do |user|
      CardsMailer.pending_cards(user).deliver_now if User::EMAIL_REGEXP.match(user.email) && user.remind_email
    end
  end
end