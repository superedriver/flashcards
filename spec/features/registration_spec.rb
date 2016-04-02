require "rails_helper"

describe "check new user registration", type: :feature do

  scenario "with valid information" do
    visit sign_up_path
    fill_in "user_email", with: "user@gmail.com"
    fill_in "user_password", with: "password"
    fill_in "user_password_confirmation", with: "password"
    click_button I18n.t("buttons.registration")

    expect(page).to have_current_path root_path
    expect(page).to have_text( I18n.t("flashes.registration.success") )
  end

  context "with invalid information" do
    scenario "non-unique email" do
      @user = create(:user)
      visit sign_up_path
      fill_in "user_email", with: @user.email
      fill_in "user_password", with: "qwerty"
      fill_in "user_password_confirmation", with: "qwerty"
      click_button I18n.t("buttons.registration")

      expect(page).to have_current_path registrations_path
      expect(page).to have_text( I18n.t("activerecord.errors.models.user.attributes.email.taken") )
    end
  end
end
