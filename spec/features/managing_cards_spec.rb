require "rails_helper"

describe "managing_cards", type: :feature do

  before(:each) do
    @card = FactoryGirl.create(:card)
    @card.update_column(:review_date, Date.current)
    visit root_path
    fill_in :email, with: @card.user.email
    fill_in :password, with: "qwerty"
    click_button I18n.t("buttons.login")
  end

  it "simple visit" do
    expect(page).to have_content I18n.t("activerecord.attributes.card.translated_text")
  end

  it "incorrect value" do
    fill_in :original_text, with: "qwerty"
    click_button I18n.t("buttons.check")
    expect(page).to have_content I18n.t("compare_result.not_right").mb_chars.upcase
  end

  it "correct value" do
    FactoryGirl.create(:card).update_column(:review_date, Date.current)
    visit root_path
    fill_in :original_text, with: "мяч"
    click_button I18n.t("buttons.check")
    expect(page).to have_content I18n.t("compare_result.right").mb_chars.upcase
  end
end
