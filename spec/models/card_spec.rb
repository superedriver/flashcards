require "rails_helper"

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
      @card = Card.new(original_text: "мяч", translated_text: "мяч")
      @card.valid?
      expect(@card.errors.messages[I18n.t("error.validation.description.the_same_value").to_sym][0]).to eq(I18n.t("error.validation.messages.the_same_value"))
    end

    it "the same values capitalize original_text" do
      @card = Card.new(original_text: "Мяч", translated_text: "мяч")
      @card.valid?
      expect(@card.errors.messages[I18n.t("error.validation.description.the_same_value").to_sym][0]).to eq(I18n.t("error.validation.messages.the_same_value"))
    end

    it "the same values capitalize translated_text" do
      @card = Card.new(original_text: "мяч", translated_text: "Мяч")
      @card.valid?
      expect(@card.errors.messages[I18n.t("error.validation.description.the_same_value").to_sym][0]).to eq(I18n.t("error.validation.messages.the_same_value"))
    end
  end
end
