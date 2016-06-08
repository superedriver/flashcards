class CardsReminder
  EMAIL_REGEXP = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i

  def self.notify_active_cards
    User.joins(:cards).merge(Card.actual_cards).uniq.each do |user|
      CardsMailer.pending_cards(user).deliver_now if EMAIL_REGEXP.match(user.email)
    end
  end
end