require "rails_helper"

describe "training_cards", type: :feature do

  context "when user is not signed" do
    scenario "visits root_path" do
      visit root_path

      expect(page).to have_text(I18n.t("flashes.login.login_first"))
      expect(page).to have_current_path login_path
    end
  end

  context "when user is signed" do
    let(:card) { create(:card) }
    let(:deck) { card.deck }
    let(:user) { deck.user }

    before do
      card.update_column(:review_date, Time.current)
      login_user_post(user.email, "qwerty")
    end

    scenario "incorrect value" do
      visit root_path
      fill_in :original_text, with: "qwerty"
      click_button I18n.t("buttons.check")

      expect(page).to have_text(I18n.t(
        "compare_result.not_right",
        text: card.original_text.mb_chars.upcase
        )
      )
      expect(page).to have_current_path root_path
    end

    scenario "misprint value" do
      create(:card).update_column(:review_date, Time.current)
      inputed_word = "мяя"
      visit root_path
      fill_in :original_text, with: inputed_word
      click_button I18n.t("buttons.check")

      expect(page).to have_text(
        I18n.t(
            "compare_result.misprint",
            correct_text: card.original_text.mb_chars.upcase,
            users_text: inputed_word.mb_chars.upcase
        )
    )
      expect(page).to have_current_path root_path
    end

    scenario "correct value" do
      create(:card).update_column(:review_date, Time.current)
      visit root_path
      fill_in :original_text, with: "мяч"
      click_button I18n.t("buttons.check")

      expect(page).to have_text(I18n.t("compare_result.right"))
      expect(page).to have_current_path root_path
    end
  end
end
