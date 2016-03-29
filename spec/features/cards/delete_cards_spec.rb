require "rails_helper"
# include Capybara::Driver::Base
# include Capybara::Selenium::Driver
# require Capybara::Driver::Base
# require Capybara::Driver::Base

describe "delete_cards", type: :feature do
# describe "delete_cards", type: :feature do

  subject { page }
  # include Capybara::RackTest::Browser

  let(:delete_button) { I18n.t("buttons.delete") }
  let(:login_button) { I18n.t("buttons.login") }

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


  # it "email" do
  #   expect(page).to have_content "Рады видитеть Вас снова!"
  # end

  describe "delete from show card path", js: true   do

    # before(:each) do
    #   @user = create(:user)
    #   visit login_path
    #   fill_in :email, with: @user.email
    #   fill_in :password, with: "qwerty"
    #   # binding.pry
    #   click_button login_button
    # end

    # before do
    #   visit card_path(card1)
    #
    #   # click_link delete_button
    #   # accept_modal(:confirm)
    #   # page.accept_confirm
    #   # page.accept_confirm { click_button "Upgrade" }
    #
    #   # accept_confirm do
    #   #   click_link('Show Confirm')
    #   # end
    #   # page.driver.browser.switch_to.confirm.accept
    # end
    #
    # # it { current_path.should == cards_path }
    # it { should have_content "Перевод" }
    it "email" do
      @user = create(:user)
      visit login_path
      fill_in :email, with: @user.email
      fill_in :password, with: "qwerty"
      # binding.pry
      click_button login_button
      expect(page).to have_content "Рады видитеть Вас снова!"
    end


  end

end

