require "rails_helper"

describe "check_registration", type: :feature do
  subject { page }

  let(:registration_button) { I18n.t("buttons.registration") }
  let(:email_field) { "user[email]" }
  let(:pass_field) { "user[password]" }
  let(:pass_conf_field) { "user[password_confirmation]" }

  let(:password) { "qwerty" }
  let(:short_password) { "qw" }
  let(:another_password) { "qwerty1" }

  let(:email) { "user@gmail.com" }
  let(:another_email) { "user1@gmail.com" }

  before { visit sign_up_path }

  it { should have_button( registration_button ) }
  it { should have_field( email_field ) }
  it { should have_field( pass_field ) }
  it { should have_field( pass_conf_field ) }
  it { should have_link(I18n.t("buttons.sign_up"), href: sign_up_path) }
  it { should have_link(I18n.t("buttons.login"), href: login_path) }
  it { should have_link( "VK", href: auth_at_provider_path("vk")) }
  it { should have_link( "FB", href: auth_at_provider_path("facebook")) }
  it { should have_content( "Регистрация нового пользователя" ) }

  describe "with valid information" do
    before do
      visit sign_up_path
      fill_in email_field, with: email
      fill_in pass_field, with: password
      fill_in pass_conf_field, with: password
      click_button registration_button
    end
    it { should have_content "WELCOME" }
    it { should have_content "Пока нет слов для изучения!" }

    it { should_not have_link(I18n.t("buttons.sign_up"), href: sign_up_path) }
    it { should_not have_link(I18n.t("buttons.login"), href: login_path) }
    it { should_not have_link( "VK", href: auth_at_provider_path("vk")) }
    it { should_not have_link( "FB", href: auth_at_provider_path("facebook")) }

    it { should have_link(I18n.t("buttons.logout"), href: logout_path) }
    it { should have_link(I18n.t("buttons.edit_profile"), href: edit_users_path) }
    it { should have_link(I18n.t("buttons.show_profile"), href: users_path) }
    it { should have_link(I18n.t("buttons.add_card"), href: new_card_path) }
    it { should have_link(I18n.t("buttons.all_cards"), href: cards_path) }
  end

  describe "negative tests" do
    before(:each) { visit sign_up_path }

    describe "non-unique email" do
      let(:user) { FactoryGirl.create(:user, email: email) }

      before do
        fill_in email_field, with: user.email
        fill_in pass_field, with: password
        fill_in pass_conf_field, with: password
        click_button registration_button
      end

      it { should have_content I18n.t("activerecord.errors.models.user.attributes.email.taken") }
    end

    describe "upcase letters in email" do
      let(:upcase_email) { "UpCasE@gmail.com" }

      describe "registration" do
        before do
          fill_in email_field, with: upcase_email
          fill_in pass_field, with: password
          fill_in pass_conf_field, with: password
          click_button registration_button
        end

        it { should have_content "WELCOME" }
        it { should have_content "Пока нет слов для изучения!" }
      end

      describe "try to register with the same downcase email" do
        before do
          FactoryGirl.create(:user, email: upcase_email)
          fill_in email_field, with: upcase_email.downcase
          fill_in pass_field, with: password
          fill_in pass_conf_field, with: password
          click_button registration_button
        end

        it { should have_content I18n.t("activerecord.errors.models.user.attributes.email.taken") }
      end
    end

    describe "password", type: :feature do
      before(:each) do
        visit sign_up_path
        fill_in email_field, with: another_email
      end

      describe "too short" do
        before do
          fill_in pass_field, with: short_password
          fill_in pass_conf_field, with: short_password
          click_button registration_button
        end

        it { should have_content I18n.t("activerecord.errors.models.user.attributes.password.too_short") }
      end

      describe "don't match" do
        before do
          fill_in pass_field, with: password
          fill_in pass_conf_field, with: another_password
          click_button registration_button
        end

        it { should have_content I18n.t("activerecord.errors.models.user.attributes.password_confirmation.confirmation") }
      end
    end
  end
end
