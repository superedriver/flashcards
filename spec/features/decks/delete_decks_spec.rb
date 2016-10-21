require 'rails_helper'

describe 'delete_decks', js: true, type: :feature do
  let(:user) { create(:user) }
  let(:deck1) { create(:deck, user_id: user.id) }
  let(:deck2) { create(:deck, user_id: user.id) }

  before do
    visit login_path
    fill_in :email, with: user.email
    fill_in :password, with: 'qwerty'
    click_button I18n.t('buttons.login')
  end

  scenario 'from show_deck_path' do
    visit deck_path(deck1)
    accept_confirm do
      click_link I18n.t('buttons.delete')
    end

    expect(page).to have_current_path decks_path
    expect(page).to have_text(I18n.t('flashes.decks.success.deleted'))
  end

  scenario 'from edit_deck_pat' do
    visit edit_deck_path(deck2)
    accept_confirm do
      click_link I18n.t('buttons.delete')
    end

    expect(page).to have_current_path decks_path
    expect(page).to have_text(I18n.t('flashes.decks.success.deleted'))
  end

  scenario 'from decks_path' do
    @deck3 = create(:deck, user_id: user.id)
    visit decks_path
    accept_confirm do
      click_link I18n.t('buttons.delete')
    end

    expect(page).to have_current_path decks_path
    expect(page).to have_text(I18n.t('flashes.decks.success.deleted'))
  end
end
