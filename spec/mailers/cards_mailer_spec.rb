require "rails_helper"

RSpec.describe CardsMailer, type: :mailer do
  describe ".pending_cards" do
    before do
      @user = create(:user)
      @mail = CardsMailer.pending_cards(@user)
    end

    describe "headers" do
      it "renders the subject" do
        expect(@mail).to have_subject("Hi! You have active cards.")
      end

      it "renders the sender email" do
        expect(@mail).to deliver_from(["noreply@flashcards.com"])
      end

      it "renders the receiver email" do
        expect(@mail).to deliver_to([@user.email])
      end
    end

    it "user.name in the letter" do
      expect(@mail).to have_body_text(@user.email)
    end
  end
end
