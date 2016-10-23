require 'rails_helper'

describe 'delete_cards', js: true, type: :feature do

  let(:user) { create(:user) }
  let(:deck) { create(:deck, user_id: user.id) }
  let(:card1) { create(:card,
                       original_text: 'card1_original_text',
                       translated_text: 'card1_translated_text',
                       deck_id: deck.id) }
  let(:card2) { create(:card,
                       original_text: 'card2_original_text',
                       translated_text: 'card2_translated_text',
                       deck_id: deck.id) }

  before do
    visit login_path
    fill_in :email, with: user.email
    fill_in :password, with: 'qwerty'
    click_button I18n.t('buttons.login')
  end

  scenario 'from show_card_path' do
    visit deck_card_path(deck, card1)
    accept_confirm I18n.t('confirm.delete_card') do
      click_link I18n.t('buttons.delete')
    end

    expect(page).to have_current_path deck_path(deck)
    expect(page).to have_text( I18n.t('flashes.cards.success.deleted') )
  end

  scenario 'from edit_card_path' do
    visit edit_deck_card_path(deck, card2)
    accept_confirm do
      click_link I18n.t('buttons.delete')
    end

    expect(page).to have_current_path deck_path(deck)
    expect(page).to have_text( I18n.t('flashes.cards.success.deleted') )
  end

  scenario 'from_cards_path' do
    @card3 = create(:card, original_text: 'card3_original_text',
                    translated_text: 'card3_translated_text',
                    deck_id: deck.id)
    visit deck_cards_path(deck)
    accept_confirm do
      click_link I18n.t('buttons.delete')
    end

    expect(page).to have_current_path deck_path(deck)
    expect(page).to have_text( I18n.t('flashes.cards.success.deleted') )
  end
end