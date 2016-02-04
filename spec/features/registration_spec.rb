require "rails_helper"
require 'securerandom'

describe "check_registration", type: :feature do

  before(:all) do
    @card = FactoryGirl.create(:card)
    @card.update_column(:review_date, Date.current)
  end

  before(:each) do
    visit root_path
    click_link I18n.t("buttons.sign_up")
  end

  it "correct" do
    fill_in "user[email]", with: "user#{SecureRandom.hex(15)}@gmail.com"
    fill_in "user[password]", with: "qwerty"
    fill_in "user[password_confirmation]", with: "qwerty"
    click_button I18n.t("buttons.registration")
    expect(page).to have_content "WELCOME"
  end

  describe "negative tests" do

    before(:all) do
      @user = FactoryGirl.create(:user, email: "user#{SecureRandom.hex(15)}@gmail.com")
    end

    it "non-unique email" do
      fill_in "user[email]", with: @user.email
      fill_in "user[password]", with: "qwerty"
      fill_in "user[password_confirmation]", with: "qwerty"
      click_button I18n.t("buttons.registration")
      expect(page).to have_content I18n.t("activerecord.errors.models.user.attributes.email.taken")
    end

    describe "password", type: :feature do

      before(:each) do
        fill_in "user[email]", with: "user#{SecureRandom.hex(15)}@gmail.com"
      end

      it "too short" do
        fill_in "user[password]", with: "qw"
        fill_in "user[password_confirmation]", with: "qw"
        click_button I18n.t("buttons.registration")
        expect(page).to have_content I18n.t("activerecord.errors.models.user.attributes.password.too_short")
      end

      it "don't match" do
        fill_in "user[password]", with: "qwer"
        fill_in "user[password_confirmation]", with: "qwert"
        click_button I18n.t("buttons.registration")
        expect(page).to have_content I18n.t("activerecord.errors.models.user.attributes.password_confirmation.confirmation")
      end
    end
  end
end