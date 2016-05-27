require "rails_helper"
require "carrierwave/test/matchers"

RSpec.describe Card, type: :model do

  before do
    @card = create(:card)
  end

  subject { @card }

  it { should respond_to(:original_text) }
  it { should respond_to(:translated_text) }
  it { should respond_to(:review_date) }
  it { should respond_to(:created_at) }
  it { should respond_to(:updated_at) }
  it { should respond_to(:deck_id) }
  it { should respond_to(:image) }
  it { should respond_to(:current_step) }
  it { should respond_to(:attempts_count) }
  it { should respond_to(:set_review_date!) }
  it { should respond_to(:set_current_step!) }
  it { should respond_to(:set_attempts_count!) }

  describe "#review date" do
    it "on create" do
      expect(@card.review_date.to_i).to eq(Time.now.to_i)
    end

    it "#set_review_date!" do
      @card.update_column(:review_date, Time.now + 3.days)
      @card.set_review_date!
      expect(@card.review_date.to_i).to eq(Time.now.to_i)
    end
  end

  describe "#attempts_count" do
    it "on create" do
      expect(@card.attempts_count).to eq(0)
    end

    it "#set_attempts_count!" do
      @card.update_column(:attempts_count, 2)
      @card.set_attempts_count!
      expect(@card.attempts_count).to eq(0)
    end
  end

  describe "#current_step" do
    it "on create" do
      expect(@card.current_step).to eq(0)
    end

    it "#set_current_step!" do
      @card.update_column(:current_step, 2)
      @card.set_current_step!
      expect(@card.current_step).to eq(0)
    end
  end

  describe "check_difference validation" do
    it "valid?" do
      expect(Card.create(original_text: "мяч", translated_text: "мяч")).to be_invalid
    end

    it "the same values" do
      @card = build(:card, original_text: "мяч", translated_text: "мяч")
      @card.valid?
      expect(@card.errors.messages[I18n.t("errors.validation.description.the_same_value").to_sym][0]).to eq(I18n.t("errors.validation.messages.the_same_value"))
    end

    it "the same values capitalize original_text" do
      @card = build(:card, original_text: "Мяч", translated_text: "мяч")
      @card.valid?
      expect(@card.errors.messages[I18n.t("errors.validation.description.the_same_value").to_sym][0]).to eq(I18n.t("errors.validation.messages.the_same_value"))
    end

    it "the same values capitalize translated_text" do
      @card = build(:card, original_text: "мяч", translated_text: "Мяч")
      @card.valid?
      expect(@card.errors.messages[I18n.t("errors.validation.description.the_same_value").to_sym][0]).to eq(I18n.t("errors.validation.messages.the_same_value"))
    end
  end

  describe "#image" do
    include CarrierWave::Test::Matchers

    before do
      @card = create(:card)
      ImageUploader.enable_processing = true
      @uploader = ImageUploader.new(@card, :image)

      File.open("./spec/files/goose.jpg") do |f|
        @uploader.store!(f)
      end
    end

    after do
      ImageUploader.enable_processing = false
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
