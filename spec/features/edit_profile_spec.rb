require "rails_helper"

describe "user edit_profile", type: :feature do

  # before(:all) do
  #   @card = FactoryGirl.create(:card)
  #   @card.update_column(:review_date, Date.current)
  # end

  before(:each) do
    @card = FactoryGirl.create(:card)
    @card.update_column(:review_date, Date.current)
    visit root_path
    fill_in :email, with: @card.user.email
    fill_in :password, with: "qwerty"
    click_button I18n.t("buttons.login")
    click_link I18n.t("buttons.edit_profile")
  end

  it "email" do
    fill_in "user[email]", with: "edited@email.com"
    click_button I18n.t("buttons.save")
    click_link I18n.t("buttons.logout")
    fill_in :email, with: "edited@email.com"
    fill_in :password, with: "qwerty"
    click_button I18n.t("buttons.login")
    expect(page).to have_content "GLAD TO SEE YOU AGAIN"
  end

  it "password" do
    fill_in "user[password]", with: "qwerty1"
    click_button I18n.t("buttons.save")
    click_link I18n.t("buttons.logout")
    fill_in :email, with: @card.user.email
    fill_in :password, with: "qwerty1"
    click_button I18n.t("buttons.login")
    expect(page).to have_content "GLAD TO SEE YOU AGAIN"
  end
end