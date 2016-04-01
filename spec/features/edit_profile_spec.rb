require "rails_helper"

describe "user edit_profile", type: :feature do

  subject { page }

  let(:user) { create(:user) }
  let(:login_button) { I18n.t("buttons.login") }
  let(:logout_button) { I18n.t("buttons.logout") }
  let(:save_button) { I18n.t("buttons.save") }
  let(:email_field) { "user[email]" }
  let(:pass_field) { "user[password]" }

  let(:another_email) { "another@email.com" }
  let(:another_password) { "another_password" }

  describe "visiting edit_users_path" do
    before do
      login_user_post(user.email, "qwerty")
      visit edit_users_path
    end
  end

  describe "edit" do
    it "email" do
      login_user_post(user.email, "qwerty")
      visit edit_users_path
      fill_in email_field, with: another_email
      click_button save_button
      expect(user.reload.email).to eq(another_email)
    end

    it "password" do
      login_user_post(user.email, "qwerty")
      visit edit_users_path
      fill_in email_field, with: user.email
      fill_in pass_field, with: "qwerty1"
      click_button save_button

      click_link logout_button
      fill_in :email, with: user.email
      fill_in :password, with: "qwerty1"
      click_button login_button
      expect(page).to have_content I18n.t("flashes.login.success")
    end
  end
end
