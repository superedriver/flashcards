require "rails_helper"

describe "create_cards", type: :feature do

  let(:user) { create(:user) }
  let(:original_text_field) { "card[original_text]" }
  let(:translated_text_field) { "card[translated_text]" }
  let(:image_field) { "card[image]" }
  let(:cancel_button) { I18n.t("buttons.cancel") }
  let(:save_button) { I18n.t("buttons.save") }

  describe "when user is not signed" do
    before { visit new_card_path }

    it { should have_current_path login_path }
    it { should have_content I18n.t('flashes.login.login_first') }
  end

  describe "when user is signed" do
    before { login_user_post(user.email, "qwerty") }

    scenario "User creates a valid card" do
      visit new_card_path
      fill_in original_text_field, with: "Hello"
      fill_in translated_text_field, with: "Привет"
      attach_file image_field, Rails.root.join("spec/files/goose.jpg")
      click_button I18n.t("buttons.save")

      expect(page).to have_text(I18n.t("flashes.cards.success.created"))
      expect(page).to have_current_path card_path(Card.last)
    end

    context "User creates invalid cards" do
      scenario "with the same values" do
        visit new_card_path
        fill_in original_text_field, with: "ball"
        fill_in translated_text_field, with: "ball"
        attach_file(image_field, Rails.root + "./spec/files/goose.jpg")
        click_button save_button

        expect(page).to have_current_path cards_path
        expect(page).to have_text("При заполнении формы возникли такие ошибки:")
        expect(page).to have_text(I18n.t("errors.validation.messages.the_same_value"))
      end

      scenario "with same upcase values" do
        visit new_card_path
        fill_in original_text_field, with: "BaLL"
        fill_in translated_text_field, with: "bALl"
        attach_file(image_field, Rails.root + "./spec/files/goose.jpg")
        click_button save_button

        expect(page).to have_current_path cards_path
        expect(page).to have_text("При заполнении формы возникли такие ошибки:")
        expect(page).to have_text(I18n.t("errors.validation.messages.the_same_value"))
      end

      scenario "with empty values" do
        visit new_card_path
        fill_in original_text_field, with: ""
        fill_in translated_text_field, with: ""
        attach_file(image_field, Rails.root + "./spec/files/goose.jpg")
        click_button save_button

        expect(page).to have_current_path cards_path
        expect(page).to have_text("При заполнении формы возникли такие ошибки:")
        expect(page).to have_text(I18n.t("activerecord.errors.models.card.attributes.original_text.blank"))
        expect(page).to have_text(I18n.t("activerecord.errors.models.card.attributes.translated_text.blank"))
      end

      scenario "with empty 'original_text' value" do
        visit new_card_path
        fill_in original_text_field, with: ""
        fill_in translated_text_field, with: "ball"
        attach_file(image_field, Rails.root + "./spec/files/goose.jpg")
        click_button save_button

        expect(page).to have_current_path cards_path
        expect(page).to have_text("При заполнении формы возникли такие ошибки:")
        expect(page).to have_text(I18n.t("activerecord.errors.models.card.attributes.original_text.blank"))
      end

      scenario "with empty 'translated_text' value" do
        visit new_card_path
        fill_in original_text_field, with: "ball"
        fill_in translated_text_field, with: ""
        attach_file(image_field, Rails.root + "./spec/files/goose.jpg")
        click_button save_button

        expect(page).to have_current_path cards_path
        expect(page).to have_text("При заполнении формы возникли такие ошибки:")
        expect(page).to have_text(I18n.t("activerecord.errors.models.card.attributes.translated_text.blank"))
      end

      scenario "incorrect image file type" do
        visit new_card_path
        fill_in original_text_field, with: "ball"
        fill_in translated_text_field, with: "мяч"
        attach_file(image_field, Rails.root + "./spec/files/benchbook.pdf")
        click_button save_button

        expect(page).to have_current_path cards_path
        expect(page).to have_text("При заполнении формы возникли такие ошибки:")
        expect(page).to have_text(I18n.t("errors.messages.extension_white_list_error"))
      end
    end
  end
end
