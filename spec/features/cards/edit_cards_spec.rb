require "rails_helper"

describe "create_cards", type: :feature do

  context "when user is not signed" do
    scenario "visits create_card_path" do
      visit new_card_path

      expect(page).to have_text(I18n.t("flashes.login.login_first"))
      expect(page).to have_current_path login_path
    end
  end

  describe "authorized user" do
    let(:card) { create(:card) }
    let(:user) { card.user }

    before do
      login_user_post(user.email, "qwerty")
    end

    scenario "edit original_text" do
      visit edit_card_path(card)
      fill_in "card_original_text", with: "new_original_text_value"
      click_button I18n.t("buttons.edit")

      expect(page).to have_current_path card_path(card)
      expect(page).to have_text( I18n.t("flashes.cards.success.updated") )
    end

    scenario "edit translated_text" do
      visit edit_card_path(card)
      fill_in "card_translated_text", with: "new_tranclated_text_value"
      click_button I18n.t("buttons.edit")

      expect(page).to have_current_path card_path(card)
      expect(page).to have_text( I18n.t("flashes.cards.success.updated") )
    end

    scenario "edit image" do
      visit edit_card_path(card)
      attach_file("card_image", Rails.root + "./spec/files/goose1.jpg")
      click_button I18n.t("buttons.edit")

      expect(page).to have_current_path card_path(card)
      expect(page).to have_text( I18n.t("flashes.cards.success.updated") )
    end

    scenario "remove image" do
      visit edit_card_path(card)
      check "card_remove_image"
      click_button I18n.t("buttons.edit")

      expect(page).to have_current_path card_path(card)
      expect(page).to have_text( I18n.t("flashes.cards.success.updated") )
    end

    context "errors" do
      scenario "with the same values" do
        visit edit_card_path(card)
        fill_in "card_original_text", with: "ball"
        fill_in "card_translated_text", with: "ball"
        attach_file("card_image", Rails.root + "./spec/files/goose.jpg")
        click_button I18n.t("buttons.edit")

        expect(page).to have_current_path card_path(card)
        expect(page).to have_text("При заполнении формы возникли такие ошибки:")
        expect(page).to have_text(I18n.t("errors.validation.messages.the_same_value"))
      end
    end
  end
end
