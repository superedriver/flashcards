require "rails_helper"

describe "check_translation service" do

  let(:user) { create(:user) }
  let(:deck) { create(:deck, user_id: user.id) }


  before do
    @card = create(:card)
    @checkTranslation = CheckTranslation.new(@card)
  end

  subject { @checkTranslation }

  it { should respond_to(:check_translation?) }
  it { should respond_to(:get_review_date) }
  it { should respond_to(:correct_answer) }
  it { should respond_to(:incorrect_answer) }

  describe "#check_translation?" do

    it "correct case" do
      expect(@checkTranslation.check_translation?("мяч")).to be true
    end

    it "incorrect case" do
      expect(@checkTranslation.check_translation?("мяч1")).to be false
    end

    it "correct case upcase leters" do
      expect(@checkTranslation.check_translation?("МЯЧ")).to be true
    end
  end


  describe "#correct_answer" do
    it "first time" do
      card = @checkTranslation.correct_answer
      expect(card[:current_step]).to eq(1)
      expect(card[:attempts_count]).to eq(0)
      expect(card[:review_date].to_i).to eq((Time.now + 12.hours).to_i)
    end

    it "second time" do
      @checkTranslation.correct_answer
      card = @checkTranslation.correct_answer
      expect(card[:current_step]).to eq(2)
      expect(card[:attempts_count]).to eq(0)
      expect(card[:review_date].to_i).to eq((Time.now + 3.days).to_i)
    end

    it "third time" do
      2.times { @checkTranslation.correct_answer }
      card = @checkTranslation.correct_answer
      expect(card[:current_step]).to eq(3)
      expect(card[:attempts_count]).to eq(0)
      expect(card[:review_date].to_i).to eq((Time.now + 1.week).to_i)
    end

    it "fourth time" do
      3.times { @checkTranslation.correct_answer }
      card = @checkTranslation.correct_answer
      expect(card[:current_step]).to eq(4)
      expect(card[:attempts_count]).to eq(0)
      expect(card[:review_date].to_i).to eq((Time.now + 2.weeks).to_i)
    end

    it "fifth time" do
      4.times { @checkTranslation.correct_answer }
      card = @checkTranslation.correct_answer
      expect(card[:current_step]).to eq(5)
      expect(card[:attempts_count]).to eq(0)
      expect(card[:review_date].to_i).to eq((Time.now + 1.month).to_i)
    end

    it "after fifth time" do
      6.times { @checkTranslation.correct_answer }
      card = @checkTranslation.correct_answer
      expect(card[:current_step]).to eq(5)
      expect(card[:attempts_count]).to eq(0)
      expect(card[:review_date].to_i).to eq((Time.now + 1.month).to_i)
    end
  end

  describe "#incorrect_answer" do
    describe "#current_step > 0" do
      it "first time" do
        @card.update_column(:current_step, 2)
        card = @checkTranslation.incorrect_answer
        expect(card[:current_step]).to eq(2)
        expect(card[:attempts_count]).to eq(1)
        expect(card[:review_date].to_i).to eq((Time.now + 3.days).to_i)
      end

      it "second time" do
        @card.update_columns(current_step: 2, attempts_count: 1)
        card = @checkTranslation.incorrect_answer
        expect(card[:current_step]).to eq(2)
        expect(card[:attempts_count]).to eq(2)
        expect(card[:review_date].to_i).to eq((Time.now + 3.days).to_i)
      end

      it "third time" do
        @card.update_columns(current_step: 2, attempts_count: 2)
        card = @checkTranslation.incorrect_answer
        expect(card[:current_step]).to eq(0)
        expect(card[:attempts_count]).to eq(0)
        expect(card[:review_date].to_i).to eq((Time.now).to_i)
      end
    end

    describe "#current_step = 0, last attempt" do
      it "last attempt" do
        @card.update_column(:attempts_count, 2)
        card = @checkTranslation.incorrect_answer
        expect(card[:current_step]).to eq(0)
        expect(card[:attempts_count]).to eq(0)
        expect(card[:review_date].to_i).to eq((Time.now).to_i)
      end
    end
  end
end
