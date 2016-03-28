require "rails_helper"
# include Capybara::Driver::Base
# include Capybara::Selenium::Driver
# require Capybara::Driver::Base
# require Capybara::Driver::Base

describe "delete_cards", type: :feature do

  subject { page }
  # include Capybara::RackTest::Browser

  let(:delete_button) { I18n.t("buttons.delete") }

  let(:card1_original_text) { "card1_original_text" }
  let(:card1_translated_text) { "card1_translated_text" }
  let(:card2_original_text) { "card2_original_text" }
  let(:card2_translated_text) { "card2_translated_text" }
  let(:card3_original_text) { "card3_original_text" }
  let(:card3_translated_text) { "card3_translated_text" }

  let(:user) { create(:user) }
  let(:card1) { create(:card,
                       original_text: card1_original_text,
                       translated_text: card1_translated_text,
                       user_id: user.id) }
  let(:card2) { create(:card,
                       original_text: card2_original_text,
                       translated_text: card2_translated_text,
                       user_id: user.id) }
  let(:card3) { create(:card,
                       original_text: card3_original_text,
                       translated_text: card3_translated_text,
                       user_id: user.id) }

  # before do
  #   Capybara.javascript_driver = :webkit
  # end

  before do
    login_user_post(user.email, "qwerty")
  end

  describe "delete from show card path", js: true  do
  # describe "delete from show card path" do
    before do
      visit card_path(card1)
      click_link delete_button
      # accept_modal(:confirm)
      # page.accept_confirm
      # page.accept_confirm { click_button "Upgrade" }

      # accept_confirm do
      #   click_link('Show Confirm')
      # end
      page.driver.browser.switch_to.confirm.accept
    end

    it { current_path.should == cards_path }
    it { should have_content "sdfbsdfb" }
  end

end

