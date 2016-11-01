require 'rails_helper'

describe 'change locale', type: :feature do
  scenario 'to :ru' do
    visit root_path
    find('.flag.flag-ru').click

    expect(page).to have_current_path root_path
    expect(page).to have_text( I18n.t('description') )
    expect(I18n.locale).to eq(:ru)
  end

  scenario 'to :en' do
    visit root_path
    find('.flag.flag-en').click

    expect(page).to have_current_path root_path
    expect(page).to have_text( I18n.t('description') )
    expect(I18n.locale).to eq(:en)
  end

  scenario 'to :ua' do
    visit root_path
    find('.flag.flag-ua').click

    expect(page).to have_current_path root_path
    expect(page).to have_text( I18n.t('description') )
    expect(I18n.locale).to eq(:ua)
  end
end