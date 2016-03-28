require "rails_helper"

describe "login spec", type: :feature do

  subject { page }
  let(:login_button) { I18n.t("buttons.login") }

  let(:user) { create(:user) }

  describe "vaild credentials" do
    before do
      visit login_path
      fill_in :email, with: user.email
      fill_in :password, with: "qwerty"
      click_button login_button
    end

    it { should have_content I18n.t("flashes.login.success") }
  end
end

