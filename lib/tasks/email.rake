namespace :email do
  desc "Send email to users who have active cards"
  task cards: :environment do
    User.notify_active_cards
  end
end
