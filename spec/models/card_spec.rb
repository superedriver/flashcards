require "rails_helper"

RSpec.describe Card, :type => :model do

  describe "check_translation? group" do
    before(:each) do
      @card = FactoryGirl.create(:card)
    end

    it "Correct translation" do
      expect(@card.check_translation?("мяч")).to eq(true)
    end

    it "Incorrect translation" do
      expect(@card.check_translation?("мяч1")).to eq(false)
    end

    it "Correct translation upcase" do
      expect(@card.check_translation?("МЯЧ")).to eq(true)
    end
  end

  describe "review date group" do
    before(:each) do
      @card = FactoryGirl.create(:card)
    end

    it "on create" do
      expect(@card.review_date).to eq(Date.current + 3.days)
    end

    it "change_review_date!" do
      @card.update_column(:review_date, Date.current - 2.day)
      @card.change_review_date!
      expect(@card.review_date).to eq(Date.current + 3.days)
    end
  end

  describe "check_difference validation" do
    # it "valid?" do
    #   expect(Card.create(original_text: "мяч", translated_text: "мяч")).to be_invalid
    # end

    it "test size" do
      @card = Card.new(original_text: "мяч", translated_text: "мяч")
      @card.valid?
      expect(@card.errors.size).to eq(1)
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