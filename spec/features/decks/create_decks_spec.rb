require "rails_helper"

describe "create_decks", type: :feature do

  let(:user) { create(:user) }

  context "when user is not signed" do
    scenario "visits create_card_path" do
      visit new_deck_path

      expect(page).to have_text(I18n.t("flashes.login.login_first"))
      expect(page).to have_current_path login_path
    end
  end

  describe "when user is signed" do
    before { login_user_post(user.email, "qwerty") }

    scenario "User creates a deck" do
      visit new_deck_path
      fill_in "deck_name", with: "MyDeck"
      click_button I18n.t("buttons.save")

      expect(page).to have_text(I18n.t("flashes.decks.success.created"))
      expect(page).to have_current_path deck_path(Deck.last)
    end
  end
end
