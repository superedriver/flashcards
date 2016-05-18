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
  it { should respond_to(:check_translation?) }
  it { should respond_to(:image) }
  it { should respond_to(:current_step) }
  it { should respond_to(:attempts_count) }
  it { should respond_to(:change_review_date!) }
  it { should respond_to(:set_review_date!) }
  it { should respond_to(:set_current_step!) }
  it { should respond_to(:set_attempts_count!) }
  it { should respond_to(:correct_answer) }
  it { should respond_to(:incorrect_answer) }

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

  describe "#correct_answer" do
    it "first time" do
      @card.correct_answer
      expect(@card.current_step).to eq(1)
      expect(@card.attempts_count).to eq(0)
      expect(@card.review_date.to_i).to eq((Time.now + 12.hours).to_i)
    end

    it "second time" do
      2.times { @card.correct_answer }
      expect(@card.current_step).to eq(2)
      expect(@card.attempts_count).to eq(0)
      expect(@card.review_date.to_i).to eq((Time.now + 3.days).to_i)
    end

    it "third time" do
      3.times { @card.correct_answer }
      expect(@card.current_step).to eq(3)
      expect(@card.attempts_count).to eq(0)
      expect(@card.review_date.to_i).to eq((Time.now + 1.week).to_i)
    end

    it "fourth time" do
      4.times { @card.correct_answer }
      expect(@card.current_step).to eq(4)
      expect(@card.attempts_count).to eq(0)
      expect(@card.review_date.to_i).to eq((Time.now + 2.weeks).to_i)
    end

    it "fifth time" do
      5.times { @card.correct_answer }
      expect(@card.current_step).to eq(5)
      expect(@card.attempts_count).to eq(0)
      expect(@card.review_date.to_i).to eq((Time.now + 1.month).to_i)
    end

    it "after fifth time" do
      7.times { @card.correct_answer }
      expect(@card.current_step).to eq(5)
      expect(@card.attempts_count).to eq(0)
      expect(@card.review_date.to_i).to eq((Time.now + 1.month).to_i)
    end
  end

  describe "#incorrect_answer" do
    describe "#current_step > 0" do
      it "first time" do
        @card.update_column(:current_step, 2)
        @card.incorrect_answer
        expect(@card.current_step).to eq(2)
        expect(@card.attempts_count).to eq(1)
        expect(@card.review_date.to_i).to eq((Time.now + 3.days).to_i)
      end

      it "second time" do
        @card.update_columns(current_step: 2, attempts_count: 1)
        @card.incorrect_answer
        expect(@card.current_step).to eq(2)
        expect(@card.attempts_count).to eq(2)
        expect(@card.review_date.to_i).to eq((Time.now + 3.days).to_i)
      end

      it "third time" do
        @card.update_columns(current_step: 2, attempts_count: 2)
        @card.incorrect_answer
        expect(@card.current_step).to eq(0)
        expect(@card.attempts_count).to eq(0)
        expect(@card.review_date.to_i).to eq((Time.now).to_i)
      end
    end

    describe "#current_step = 0" do
      it "last attempt" do
        @card.update_column(:attempts_count, 2)
        @card.incorrect_answer
        expect(@card.current_step).to eq(0)
        expect(@card.attempts_count).to eq(0)
        expect(@card.review_date.to_i).to eq((Time.now).to_i)
      end
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
