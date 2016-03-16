require "rails_helper"

describe "user edit_profile", type: :feature do

  subject { page }

  let(:user) { FactoryGirl.create(:user) }
  let(:login_button) { I18n.t("buttons.login") }
  let(:logout_button) { I18n.t("buttons.logout") }
  let(:edit_profile_button) { I18n.t("buttons.edit_profile") }
  let(:save_button) { I18n.t("buttons.save") }
  let(:cansel_button) { I18n.t("buttons.cansel") }
  let(:email_field) { "user[email]" }
  let(:pass_field) { "user[password]" }

  let(:another_email) { "another@email.com" }
  let(:another_password) { "another_password" }

  describe "visiting edit_users_path" do
    before do
      login_user_post(user.email, "qwerty")
      visit edit_users_path
    end

    it { should have_content( "Редактирование пользователя" ) }
    it { should have_content( "User ID: " + user.id.to_s ) }
    it { should have_content I18n.t("activerecord.attributes.user.email") }
    it { should have_content I18n.t("activerecord.attributes.user.password") }
    it { should have_button save_button }
    it { should have_link cansel_button }
    it { should have_field( email_field ) }
    it { should have_field( pass_field ) }
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