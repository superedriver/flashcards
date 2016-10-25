require 'rails_helper'

describe 'login spec', type: :feature do

  let(:user) { create(:user) }

  context 'invaild credentials' do
    scenario 'email' do
      visit login_path
      fill_in :email, with: 'vrong email'
      fill_in :password, with: 'qwerty'
      click_button I18n.t('buttons.login')

      expect(page).to have_current_path sessions_path
      expect(page).to have_text( I18n.t('flashes.login.failed') )
    end

    scenario 'password' do
      visit login_path
      fill_in :email, with: user.email
      fill_in :password, with: 'vrong password'
      click_button I18n.t('buttons.login')

      expect(page).to have_current_path sessions_path
      expect(page).to have_text( I18n.t('flashes.login.failed') )
    end
  end

  context 'vaild credentials' do
    scenario 'password' do
      visit login_path
      fill_in :email, with: user.email
      fill_in :password, with: 'qwerty'
      click_button I18n.t('buttons.login')

      expect(page).to have_current_path root_path
      expect(page).to have_text( I18n.t('flashes.login.success') )
    end
  end
end

