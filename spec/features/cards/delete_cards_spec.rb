require "rails_helper"

describe "delete_cards", js: true, type: :feature do

  let(:user) { create(:user) }
  let(:card1) { create(:card,
                       original_text: "card1_original_text",
                       translated_text: "card1_translated_text",
                       user_id: user.id) }
  let(:card2) { create(:card,
                       original_text: "card2_original_text",
                       translated_text: "card2_translated_text",
                       user_id: user.id) }

  before do
    visit login_path
    fill_in :email, with: user.email
    fill_in :password, with: "qwerty"
    click_button I18n.t("buttons.login")
  end

  scenario "from show_card_path" do
    visit card_path(card1)
    accept_confirm do
      click_link I18n.t("buttons.delete")
    end

    expect(page).to have_current_path cards_path
    expect(page).to have_text( I18n.t("flashes.cards.success.deleted") )
  end

  scenario "from edit_card_pat" do
    visit edit_card_path(card2)
    accept_confirm do
      click_link I18n.t("buttons.delete")
    end

    expect(page).to have_current_path cards_path
    expect(page).to have_text( I18n.t("flashes.cards.success.deleted") )
  end

  scenario "from edit_card_pat" do
    @card3 = create(:card, original_text: "card3_original_text",
                    translated_text: "card3_translated_text",
                    user_id: user.id)
    visit cards_path
    accept_confirm do
      click_link I18n.t("buttons.delete")
    end

    expect(page).to have_current_path cards_path
    expect(page).to have_text( I18n.t("flashes.cards.success.deleted") )
  end
end