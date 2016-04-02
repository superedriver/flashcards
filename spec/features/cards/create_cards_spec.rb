require "rails_helper"

describe "create_cards", type: :feature do

  let(:user) { create(:user) }

  context "when user is not signed" do
    scenario "visits create_card_path" do
      visit new_card_path

      expect(page).to have_text(I18n.t("flashes.login.login_first"))
      expect(page).to have_current_path login_path
    end
  end

  describe "when user is signed" do
    before { login_user_post(user.email, "qwerty") }

    scenario "User creates a valid card" do
      visit new_card_path
      fill_in "card_original_text", with: "Hello"
      fill_in "card_translated_text", with: "Привет"
      attach_file "card_image", Rails.root.join("spec/files/goose.jpg")
      click_button I18n.t("buttons.save")

      expect(page).to have_text(I18n.t("flashes.cards.success.created"))
      expect(page).to have_current_path card_path(Card.last)
    end

    context "User creates invalid cards" do
      scenario "with the same values" do
        visit new_card_path
        fill_in "card_original_text", with: "ball"
        fill_in "card_translated_text", with: "ball"
        attach_file("card_image", Rails.root + "./spec/files/goose.jpg")
        click_button I18n.t("buttons.save")

        expect(page).to have_current_path cards_path
        expect(page).to have_text("При заполнении формы возникли такие ошибки:")
        expect(page).to have_text(I18n.t("errors.validation.messages.the_same_value"))
      end
    end
  end
end
