require "rails_helper"

describe "create_cards", type: :feature do

  subject { page }
  let(:card) { create(:card) }
  let(:user) { card.user }

  describe "non authorized user" do
    before do
      visit edit_card_path(card)
    end

    it { should have_current_path login_path }
    it { should have_content I18n.t('flashes.login.login_first') }
  end

  describe "authorized user" do
    let(:card) { create(:card) }
    let(:user) { card.user }

    let(:original_text_field) { "card[original_text]" }
    let(:translated_text_field) { "card[translated_text]" }
    let(:image_field) { "card[image]" }
    let(:remove_checkbox) { "card[remove_image]" }

    let(:cancel_button) { I18n.t("buttons.cancel") }
    let(:edit_button) { I18n.t("buttons.edit") }

    before do
      login_user_post(user.email, "qwerty")
      visit edit_card_path(card)
    end

    describe "cancel button" do
      before do
        visit edit_card_path(card)
        click_link cancel_button
      end

      it { should have_current_path cards_path }
    end

    describe "edit original text" do
      let(:new_original_text_value) { "some_original_text" }
      before do
        visit edit_card_path(card)
        fill_in original_text_field, with: new_original_text_value
        click_button edit_button
      end

      it { should have_current_path card_path(card) }
      it { should have_content new_original_text_value }
    end

    describe "edit translated text" do
      let(:new_translated_text_value) { "some_translated_text" }
      before do
        visit edit_card_path(card)
        fill_in translated_text_field, with: new_translated_text_value
        click_button edit_button
      end

      it { should have_current_path card_path(card) }
      it { should have_content new_translated_text_value }
    end

    describe "edit image" do
      before do
        visit edit_card_path(card)
        attach_file(image_field, Rails.root + "./spec/files/goose1.jpg")
        click_button edit_button
      end

      it { should have_current_path card_path(card) }
      it { should_not have_css "img[src*='goose.jpg']" }
      it { should have_css "img[src*='goose1.jpg']" }
    end

    describe "remove image" do
      before do
        visit edit_card_path(card)
        check remove_checkbox
        click_button edit_button
      end

      it { should have_current_path card_path(card) }
      it { should_not have_css "img[src*='goose.jpg']" }
      it { should_not have_css "img[src*='goose1.jpg']" }
    end

    describe "errors" do
      describe "the same values" do
        let(:value) { "ball" }

        before do
          visit edit_card_path(card)
          fill_in original_text_field, with: value
          fill_in translated_text_field, with: value
          click_button edit_button
        end

        it { should have_current_path card_path(card) }
        it { should have_content "При заполнении формы возникли такие ошибки:" }
        it { should have_content I18n.t("errors.validation.messages.the_same_value") }
      end

      describe "the same values with upcase" do
        let(:inputed_original_text) { "ball" }
        let(:inputed_translated_text) { "BALL" }

        before do
          visit edit_card_path(card)
          fill_in original_text_field, with: inputed_original_text
          fill_in translated_text_field, with: inputed_translated_text
          click_button edit_button
        end

        it { should have_current_path card_path(card) }
        it { should have_content "При заполнении формы возникли такие ошибки:" }
        it { should have_content I18n.t("errors.validation.messages.the_same_value") }
      end

      describe "empty values original_text and translated_text" do
        before do
          visit edit_card_path(card)
          fill_in original_text_field, with: ""
          fill_in translated_text_field, with: ""
          click_button edit_button
        end

        it { should have_current_path card_path(card) }
        it { should have_content "При заполнении формы возникли такие ошибки:" }
        it { should have_content I18n.t("activerecord.errors.models.card.attributes.original_text.blank") }
        it { should have_content I18n.t("activerecord.errors.models.card.attributes.translated_text.blank") }
      end

      describe "empty value original_text" do
        before do
          visit edit_card_path(card)
          fill_in original_text_field, with: ""
          click_button edit_button
        end

        it { should have_current_path card_path(card) }
        it { should have_content "При заполнении формы возникли такие ошибки:" }
        it { should have_content I18n.t("activerecord.errors.models.card.attributes.original_text.blank") }
      end

      describe "empty value translated_text" do
        before do
          visit edit_card_path(card)
          fill_in translated_text_field, with: ""
          click_button edit_button
        end

        it { should have_current_path card_path(card) }
        it { should have_content "При заполнении формы возникли такие ошибки:" }
        it { should have_content I18n.t("activerecord.errors.models.card.attributes.translated_text.blank") }
      end

      describe "incorrect image file type" do
        before do
          visit edit_card_path(card)
          attach_file(image_field, Rails.root + "./spec/files/benchbook.pdf")
          click_button edit_button
        end

        it { should have_current_path card_path(card) }
        it { should have_content "При заполнении формы возникли такие ошибки:" }
        it { should have_content I18n.t("errors.messages.extension_white_list_error") }
      end
    end
  end
end
