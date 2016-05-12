require "rails_helper"

describe "edit_decks", type: :feature do
  let(:deck) { create(:deck) }
  let(:user) { deck.user }

  context "when user is not signed" do
    scenario "visits create_card_path" do
      visit deck_path(deck)

      expect(page).to have_text(
                          I18n.t("flashes.login.login_first"))
      expect(page).to have_current_path login_path
    end
  end

  describe "authorized user" do
    before do
      login_user_post(user.email, "qwerty")
    end

    scenario "edit name" do
      visit edit_deck_path(deck)
      fill_in "deck_name", with: "new_name"
      click_button I18n.t("buttons.edit")

      expect(page).to have_text(I18n.t("flashes.decks.success.updated"))
      expect(page).to have_current_path decks_path
    end
  end
end
