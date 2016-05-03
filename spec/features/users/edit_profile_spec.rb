require "rails_helper"

describe "user edit_profile", type: :feature do

  let(:user) { create(:user) }

  before do
    login_user_post(user.email, "qwerty")
  end

  scenario "email" do
    visit edit_users_path
    fill_in "user_email", with: "another_email@email.com"
    click_button I18n.t("buttons.save")

    expect(page).to have_text( I18n.t("flashes.users.success.updated") )
    expect(page).to have_current_path users_path
  end

  scenario "password" do
    visit edit_users_path
    fill_in "user_password", with: "qwerty1"
    click_button I18n.t("buttons.save")

    expect(page).to have_text( I18n.t("flashes.users.success.updated") )
    expect(page).to have_current_path users_path
  end
end
