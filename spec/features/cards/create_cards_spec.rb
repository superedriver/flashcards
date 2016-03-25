require "rails_helper"

describe "create_cards", type: :feature do
  include CarrierWave::Test::Matchers

  subject { page }
  let(:user) { create(:user) }
  let(:login_button) { I18n.t("buttons.login") }
  let(:original_text_field) { "card[original_text]" }
  let(:translated_text_field) { "card[translated_text]" }
  let(:image_field) { "card[image]" }
  let(:cansel_button) { I18n.t("buttons.cansel") }
  let(:save_button) { I18n.t("buttons.save") }
  let(:edit_button) { I18n.t("buttons.edit") }
  let(:delete_button) { I18n.t("buttons.delete") }

  let(:review_date) { I18n.t("activerecord.attributes.card.review_date") }
  let(:original_text) { I18n.t("activerecord.attributes.card.original_text") }
  let(:translated_text) { I18n.t("activerecord.attributes.card.translated_text") }
  let(:image) { I18n.t("activerecord.attributes.card.image") }

  before do
    login_user_post(user.email, "qwerty")
    visit new_card_path
  end

  it { should_not have_link(I18n.t("buttons.sign_up"), href: sign_up_path) }
  it { should_not have_link(I18n.t("buttons.login"), href: login_path) }
  it { should_not have_link( "VK", href: auth_at_provider_path("vk")) }
  it { should_not have_link( "FB", href: auth_at_provider_path("facebook")) }

  it { should have_link(I18n.t("buttons.logout"), href: logout_path) }
  it { should have_link(I18n.t("buttons.edit_profile"), href: edit_users_path) }
  it { should have_link(I18n.t("buttons.show_profile"), href: users_path) }
  it { should have_link(I18n.t("buttons.add_card"), href: new_card_path) }
  it { should have_link(I18n.t("buttons.all_cards"), href: cards_path) }

  it { should have_content "Создать новую карту:" }
  it { should have_content original_text }
  it { should have_content translated_text }
  it { should have_content image + " (jpg, jpeg, gif, png)" }
  it { should have_field(original_text_field) }
  it { should have_field(translated_text_field) }
  it { should have_field(image_field) }
  it { should have_button save_button }
  it { should have_link cansel_button }

  # before do
  #   @card = create(:card)
  #   ImageUploader.enable_processing = true
  #   @uploader = ImageUploader.new(@card, :image)
  #
  #   File.open("./spec/files/goose.JPG") do |f|
  #     @uploader.store!(f)
  #   end
  # end

  # after do
  #   ImageUploader.enable_processing = false
  #   @uploader.remove!
  # end

  # describe "Image uploader" do
  #   before do
  #     visit new_card_path
  #     fill_in original_text_field, with: "ball"
  #     fill_in translated_text_field, with: "мяч"
  #     attach_file(image_field, Rails.root + "./spec/files/goose.JPG")
  #     click_button save_button
  #   end
  #
  #   it { should have_content "Card ID" }
  #
  # end

  describe "valid" do
    before do
      visit new_card_path
      fill_in original_text_field, with: "ball"
      fill_in translated_text_field, with: "мяч"
      attach_file(image_field, Rails.root + "./spec/files/goose.JPG")
      click_button save_button
      # @uploader = ImageUploader.new(@card, :image)
    end


    it { should have_content "Card ID" }
    it { should have_content original_text }
    it { should have_content translated_text }
    it { should have_content image }
    it { should have_content "ball" }
    it { should have_content "мяч" }
    it { should have_content I18n.l(3.days.from_now.to_date) }

    it { should_not have_field(original_text_field) }
    it { should_not have_field(translated_text_field) }
    it { should_not have_field(image_field) }

    it { should have_link delete_button }
    it { should have_link cansel_button }
    it { should have_link edit_button }
    it "should have image" do
      expect(page.html).should have_content('img')
    end
  end

  describe "errors" do
    describe "of the same values" do
      before do
        visit new_card_path
        fill_in original_text_field, with: "ball"
        fill_in translated_text_field, with: "ball"
        attach_file(image_field, Rails.root + "./spec/files/goose.JPG")
        click_button save_button
      end

      it { should have_content "Создать новую карту:" }
      it { should have_content original_text }
      it { should have_content translated_text }
      it { should have_content image + " (jpg, jpeg, gif, png)" }
      it { should have_field(original_text_field) }
      it { should have_field(translated_text_field) }
      it { should have_field(image_field) }
      it { should have_button save_button }
      it { should have_link cansel_button }

      it { should have_content "При заполнении формы возникли такие ошибки:" }
      it { should have_content I18n.t("errors.validation.messages.the_same_value") }

      it { should have_content "мяч" }
    end
  end
end
