namespace :flashcards do
  namespace :emails do
    desc "Send email to each user who has active cards"
    task cards: :environment do
      User.notify_active_cards
    end
  end
end

