require "rails_helper"
require "carrierwave/test/matchers"

RSpec.describe Card, type: :model do

  before do
    @card = FactoryGirl.create(:card)
  end

  subject { @card }

  it { should respond_to(:original_text) }
  it { should respond_to(:translated_text) }
  it { should respond_to(:review_date) }
  it { should respond_to(:created_at) }
  it { should respond_to(:updated_at) }
  it { should respond_to(:user_id) }
  it { should respond_to(:check_translation?) }
  it { should respond_to(:image) }

  describe "#check_translation?" do

    it "correct case" do
      expect(@card.check_translation?("мяч")).to be true
    end

    it "incorrect case" do
      expect(@card.check_translation?("мяч1")).to be false
    end

    it "correct case upcase leters" do
      expect(@card.check_translation?("МЯЧ")).to be true
    end
  end

  describe "#review date" do
    it "on create" do
      expect(@card.review_date.to_date).to eq(3.days.from_now.to_date)
    end

    it "change_review_date!" do
      @card.update_column(:review_date, 2.days.ago.to_date)
      expect {
        @card.change_review_date!
      }.to change { @card.review_date }.to(3.days.from_now.to_date)
    end
  end

  describe "check_difference validation" do
    it "valid?" do
      expect(Card.create(original_text: "мяч", translated_text: "мяч")).to be_invalid
    end

    it "the same values" do
      @card = FactoryGirl.build(:card, original_text: "мяч", translated_text: "мяч")
      @card.valid?
      expect(@card.errors.messages[I18n.t("errors.validation.description.the_same_value").to_sym][0]).to eq(I18n.t("errors.validation.messages.the_same_value"))
    end

    it "the same values capitalize original_text" do
      @card = FactoryGirl.build(:card, original_text: "Мяч", translated_text: "мяч")
      @card.valid?
      expect(@card.errors.messages[I18n.t("errors.validation.description.the_same_value").to_sym][0]).to eq(I18n.t("errors.validation.messages.the_same_value"))
    end

    it "the same values capitalize translated_text" do
      @card = FactoryGirl.build(:card, original_text: "мяч", translated_text: "Мяч")
      @card.valid?
      expect(@card.errors.messages[I18n.t("errors.validation.description.the_same_value").to_sym][0]).to eq(I18n.t("errors.validation.messages.the_same_value"))
    end
  end

  describe "#image" do
    include CarrierWave::Test::Matchers

    before do
      @card = FactoryGirl.create(:card)
      CardImageUploader.enable_processing = true
      @uploader = CardImageUploader.new(@card, :image)

      File.open("./spec/files/goose.JPG") do |f|
        @uploader.store!(f)
      end
    end

    after do
      CardImageUploader.enable_processing = false
      @uploader.remove!
    end

    context 'the main version' do
      it "should have dimensions not larger than 360 by 360 pixels" do
        expect(@uploader).to be_no_larger_than(360, 360)
      end
    end

    context 'the thumb version' do
      it "should scale down a landscape image to be exactly 100 by 75 pixels" do
        expect(@uploader.thumb).to have_dimensions(100, 75)
      end
    end
  end
end
