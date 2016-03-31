require "rails_helper"

describe "training_cards", type: :feature do

  subject { page }
  let(:card) { create(:card) }
  let(:user) { card.user }
  let(:check_button) { I18n.t("buttons.check") }
  let(:login_button) { I18n.t("buttons.login") }

  describe "user has cards to learn" do
    before do
      card.update_column(:review_date, Date.current)
      visit root_path
      fill_in :email, with: card.user.email
      fill_in :password, with: "qwerty"
      click_button login_button
      visit root_path
    end

    it { should have_content I18n.t("activerecord.attributes.card.translated_text") }
    it { should have_content "Введите перевод слова" }
    it { should have_button check_button }

    describe "incorrect value" do
      before do
        fill_in :original_text, with: "qwerty"
        click_button check_button
      end

      it { should have_current_path root_path }
      it { should have_content I18n.t("compare_result.not_right", text: card.original_text.mb_chars.upcase) }
    end

    describe "correct value" do
      before do
        create(:card).update_column(:review_date, Date.current)
        visit root_path
        fill_in :original_text, with: "мяч"
        click_button check_button
      end

      it { should have_current_path root_path }
      it { should have_content I18n.t("compare_result.right") }
    end
  end
end
