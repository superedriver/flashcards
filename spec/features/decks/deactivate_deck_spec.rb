require "rails_helper"

describe "activate/deactivate_deck", type: :feature do

  context "when user is not signed" do
    scenario "visits create_card_path" do
      visit decks_path

      expect(page).to have_text(I18n.t("flashes.login.login_first"))
      expect(page).to have_current_path login_path
    end
  end

  describe "authorized user" do

    let(:user) { create(:user)}

    before do
      login_user_post(user.email, "qwerty")
      @deck1 = create(:deck, name: "deck1", user_id: user.id)
      @deck2 = create(:deck, name: "deck2", user_id: user.id)
      @deck3 = create(:deck, name: "deck3", user_id: user.id)
    end

    scenario "deactivate deck" do
      visit activate_deck_path(@deck1)
      visit decks_path
      click_link( I18n.t("buttons.deactivate") )

      expect(page).not_to have_link(I18n.t("buttons.deactivate"))
      expect(page).to have_link(
                          I18n.t("buttons.activate"),
                          href: "/decks/#{@deck1.id}/activate")
      expect(page).to have_link(
                          I18n.t("buttons.activate"),
                          href: "/decks/#{@deck2.id}/activate")
      expect(page).to have_link(
                          I18n.t("buttons.activate"),
                          href: "/decks/#{@deck3.id}/activate")
      expect(page).to have_current_path decks_path
    end
  end
end
