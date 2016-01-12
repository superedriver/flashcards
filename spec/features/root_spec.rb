describe "check_root_path", type: :feature do
  it "signs me in" do
    visit root_path
    expect(page).to have_content I18n.t('activerecord.attributes.card.translated_text')
  end

  # it "signs me in" do
  #   visit root_path
  #   within("#session") do
  #     fill_in 'Email', :with => 'user@example.com'
  #     fill_in 'Password', :with => 'password'
  #   end
  #   expect(page).to have_content I18n.t('activerecord.attributes.card.translated_text')
  # end

end
