require "rails_helper"

describe "create_cards", type: :feature do

  subject { page }
  let(:user) { create(:user) }
  let(:original_text_field) { "card[original_text]" }
  let(:translated_text_field) { "card[translated_text]" }
  let(:image_field) { "card[image]" }
  let(:cancel_button) { I18n.t("buttons.cancel") }
  let(:save_button) { I18n.t("buttons.save") }


  describe "non authorized user" do
    before do
      visit new_card_path
    end

    it { should have_current_path login_path }
    it { should have_content I18n.t('flashes.login.login_first') }
  end

  describe "authorized user" do
    before do
      login_user_post(user.email, "qwerty")
      visit new_card_path
    end

    describe "cancel button" do
      before do
        click_link cancel_button
      end

      it { should have_current_path cards_path }
    end

    describe "valid card" do
      let(:inputed_original_text) { "ball" }
      let(:inputed_translated_text) { "мяч" }

      before do
        visit new_card_path
        fill_in original_text_field, with: inputed_original_text
        fill_in translated_text_field, with: inputed_translated_text
        attach_file(image_field, Rails.root + "./spec/files/goose.jpg")
        click_button save_button
      end

      it { should have_current_path card_path(Card.last) }
      it { should have_content inputed_original_text }
      it { should have_content inputed_translated_text }
      it { should have_content I18n.l(3.days.from_now.to_date) }
      it { should have_css "img[src*='goose.jpg']" }
    end

    describe "invalid card of" do
      describe "the same values" do
        let(:value) { "ball" }

        before do
          visit new_card_path
          fill_in original_text_field, with: value
          fill_in translated_text_field, with: value
          attach_file(image_field, Rails.root + "./spec/files/goose.jpg")
          click_button save_button
        end

        it { should have_current_path cards_path }
        it { should have_content "При заполнении формы возникли такие ошибки:" }
        it { should have_content I18n.t("errors.validation.messages.the_same_value") }
      end

      describe "the same values with upcase" do
        let(:inputed_original_text) { "ball" }
        let(:inputed_translated_text) { "BALL" }

        before do
          visit new_card_path
          fill_in original_text_field, with: inputed_original_text
          fill_in translated_text_field, with: inputed_translated_text
          attach_file(image_field, Rails.root + "./spec/files/goose.jpg")
          click_button save_button
        end

        it { should have_current_path cards_path }
        it { should have_content "При заполнении формы возникли такие ошибки:" }
        it { should have_content I18n.t("errors.validation.messages.the_same_value") }
      end

      describe "empty values original_text and translated_text" do
        before do
          visit new_card_path
          click_button save_button
        end

        it { should have_current_path cards_path }
        it { should have_content "При заполнении формы возникли такие ошибки:" }
        it { should have_content I18n.t("activerecord.errors.models.card.attributes.original_text.blank") }
        it { should have_content I18n.t("activerecord.errors.models.card.attributes.translated_text.blank") }
      end

      describe "empty value original_text" do
        before do
          visit new_card_path
          fill_in translated_text_field, with: "ball"
          click_button save_button
        end

        it { should have_current_path cards_path }
        it { should have_content "При заполнении формы возникли такие ошибки:" }
        it { should have_content I18n.t("activerecord.errors.models.card.attributes.original_text.blank") }
      end


      describe "empty value translated_text" do
        before do
          visit new_card_path
          fill_in original_text_field, with: "ball"
          click_button save_button
        end

        it { should have_current_path cards_path }
        it { should have_content "При заполнении формы возникли такие ошибки:" }
        it { should have_content I18n.t("activerecord.errors.models.card.attributes.translated_text.blank") }
      end


      describe "incorrect image file type" do
        before do
          visit new_card_path
          fill_in original_text_field, with: "ball"
          fill_in translated_text_field, with: "мяч"
          attach_file(image_field, Rails.root + "./spec/files/benchbook.pdf")
          click_button save_button
        end

        it { should have_current_path cards_path }
        it { should have_content "При заполнении формы возникли такие ошибки:" }
        it { should have_content I18n.t("errors.messages.extension_white_list_error") }
      end
    end
  end
end
