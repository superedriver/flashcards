require "rails_helper"

describe "SuperMemo2 service" do
  before do
    Timecop.freeze(Time.now)
  end

  after do
    Timecop.return
  end

  describe "#check_translation" do
    describe "correct case" do
      it "should return right success? and message" do
        card = create(:card)
        result = SuperMemo2.new(card,0).check_translation("мяч")
        expect(result.success?).to eq(true)
        expect(result.message).to eq(I18n.t("compare_result.right"))
      end

      describe "perfect response" do
        before(:all) do
          @BEFORE_HESITATION = SuperMemo2::HESITATION_START - 1
        end

        it "the first attempt" do
          card = create(:card)
          SuperMemo2.new(card, @BEFORE_HESITATION).check_translation("мяч")
          expect(card[:current_step]).to eq(1)
          expect(card[:e_factor]).to eq(2.6)
          expect(card[:review_date]).to eq(1.day.from_now)
        end

        it "the second attempt" do
          card = create(:card)
          2.times{ SuperMemo2.new(card, @BEFORE_HESITATION).check_translation("мяч") }
          expect(card[:current_step]).to eq(2)
          expect(card[:e_factor]).to eq(2.7)
          expect(card[:review_date]).to eq(6.day.from_now)
        end

        it "the third attempt" do
          card = create(:card)
          3.times{ SuperMemo2.new(card, @BEFORE_HESITATION).check_translation("мяч") }
          expect(card[:current_step]).to eq(3)
          expect(card[:e_factor]).to eq(2.8)
          expect(card[:review_date].to_i).to eq(((16.8).days.from_now).to_i)
        end

        it "the fourth attempt" do
          card = create(:card)
          4.times{ SuperMemo2.new(card, @BEFORE_HESITATION).check_translation("мяч") }
          expect(card[:current_step]).to eq(4)
          expect(card[:e_factor]).to eq(2.9)
          expect(card[:review_date].to_i).to eq(((48.72).days.from_now).to_i)
        end
      end

      describe "correct response after a hesitation" do
        before do
          @HESITATION = SuperMemo2::HESITATION_START
        end

        it "the first attempt" do
          card = create(:card)
          SuperMemo2.new(card, @HESITATION).check_translation("мяч")
          expect(card[:current_step]).to eq(1)
          expect(card[:e_factor]).to eq(2.5)
          expect(card[:review_date]).to eq(1.day.from_now)
        end

        it "the second attempt" do
          card = create(:card)
          2.times{ SuperMemo2.new(card, @HESITATION).check_translation("мяч") }
          expect(card[:current_step]).to eq(2)
          expect(card[:e_factor]).to eq(2.5)
          expect(card[:review_date]).to eq(6.day.from_now)
        end

        it "the third attempt" do
          card = create(:card)
          3.times{ SuperMemo2.new(card, @HESITATION).check_translation("мяч") }
          expect(card[:current_step]).to eq(3)
          expect(card[:e_factor]).to eq(2.5)
          expect(card[:review_date].to_i).to eq((15.days.from_now).to_i)
        end

        it "the fourth attempt" do
          card = create(:card)
          4.times{ SuperMemo2.new(card, @HESITATION).check_translation("мяч") }
          expect(card[:current_step]).to eq(4)
          expect(card[:e_factor]).to eq(2.5)
          expect(card[:review_date].to_i).to eq(((37.5).days.from_now).to_i)
        end
      end

      describe "correct response recalled with serious difficulty" do
        before do
          @DIFFICULTY = SuperMemo2::DIFFICULTY_START + 1
        end

        it "the first attempt" do
          card = create(:card)
          SuperMemo2.new(card, @DIFFICULTY).check_translation("мяч")
          expect(card[:current_step]).to eq(1)
          expect(card[:e_factor]).to eq(2.36)
          expect(card[:review_date]).to eq(1.day.from_now)
        end

        it "the second attempt" do
          card = create(:card)
          2.times{ SuperMemo2.new(card, @DIFFICULTY).check_translation("мяч") }
          expect(card[:current_step]).to eq(2)
          expect(card[:e_factor]).to eq(2.22)
          expect(card[:review_date]).to eq(6.day.from_now)
        end

        it "the third attempt" do
          card = create(:card)
          3.times{ SuperMemo2.new(card, @DIFFICULTY).check_translation("мяч") }
          expect(card[:current_step]).to eq(3)
          expect(card[:e_factor]).to eq(2.08)
          expect(card[:review_date].to_i).to eq(((12.48).days.from_now).to_i)
        end

        it "the fourth attempt" do
          card = create(:card)
          4.times{ SuperMemo2.new(card, @DIFFICULTY).check_translation("мяч") }
          expect(card[:current_step]).to eq(4)
          expect(card[:e_factor]).to eq(1.94)
          expect(card[:review_date].to_i).to eq(((24.2112).days.from_now).to_i)
        end
      end
    end

    describe "misprint_case" do
      it "should return right success? and message" do
        card = create(:card)
        inputed_text = "мяф"
        result = SuperMemo2.new(card, 0).check_translation(inputed_text)
        expect(result.success?).to eq(false)
        expect(result.message).to eq(
          I18n.t(
            "compare_result.misprint",
            correct_text: card[:original_text].mb_chars.upcase,
            users_text: inputed_text.mb_chars.upcase
          )
        )
      end

      it "the first attempt" do
        card = create(:card)
        SuperMemo2.new(card, 0).check_translation("мяф")
        expect(card[:current_step]).to eq(1)
        expect(card[:e_factor]).to eq(2.18)
        expect(card[:review_date]).to eq(1.day.from_now)
      end

      it "the second attempt" do
        card = create(:card)
        2.times{ SuperMemo2.new(card, @BEFORE_HESITATION).check_translation("мяф") }
        expect(card[:current_step]).to eq(1)
        expect(card[:e_factor]).to eq(1.86)
        expect(card[:review_date]).to eq(1.day.from_now)
      end

      it "the third attempt" do
        card = create(:card)
        3.times{ SuperMemo2.new(card, @BEFORE_HESITATION).check_translation("мяф") }
        expect(card[:current_step]).to eq(1)
        expect(card[:e_factor]).to eq(1.54)
        expect(card[:review_date]).to eq(1.day.from_now)
      end

      it "the fourth attempt" do
        card = create(:card)
        4.times{ SuperMemo2.new(card, @BEFORE_HESITATION).check_translation("мяф") }
        expect(card[:current_step]).to eq(1)
        expect(card[:e_factor]).to eq(1.3)
        expect(card[:review_date]).to eq(1.day.from_now)
      end

      it "the fifth attempt" do
        card = create(:card)
        5.times{ SuperMemo2.new(card, @BEFORE_HESITATION).check_translation("мяф") }
        expect(card[:current_step]).to eq(1)
        expect(card[:e_factor]).to eq(1.3)
        expect(card[:review_date]).to eq(1.day.from_now)
      end
    end

    describe "incorrect_case, the correct one remembered" do
      it "should return right success? and message" do
        card = create(:card)
        inputed_text = "мя"
        result = SuperMemo2.new(card, 0).check_translation(inputed_text)
        expect(result.success?).to eq(false)
        expect(result.message).to eq(
          I18n.t("compare_result.not_right",
            text: card[:original_text].mb_chars.upcase)
        )
      end

      it "the first attempt" do
        card = create(:card)
        SuperMemo2.new(card, 0).check_translation("мя")
        expect(card[:current_step]).to eq(1)
        expect(card[:e_factor]).to eq(1.96)
        expect(card[:review_date]).to eq(1.day.from_now)
      end

      it "the second attempt" do
        card = create(:card)
        2.times{ SuperMemo2.new(card, @BEFORE_HESITATION).check_translation("мя") }
        expect(card[:current_step]).to eq(1)
        expect(card[:e_factor]).to eq(1.42)
        expect(card[:review_date]).to eq(1.day.from_now)
      end

      it "the third attempt" do
        card = create(:card)
        3.times{ SuperMemo2.new(card, @BEFORE_HESITATION).check_translation("мя") }
        expect(card[:current_step]).to eq(1)
        expect(card[:e_factor]).to eq(1.3)
        expect(card[:review_date]).to eq(1.day.from_now)
      end

      it "the fourth attempt" do
        card = create(:card)
        4.times{ SuperMemo2.new(card, @BEFORE_HESITATION).check_translation("мя") }
        expect(card[:current_step]).to eq(1)
        expect(card[:e_factor]).to eq(1.3)
        expect(card[:review_date]).to eq(1.day.from_now)
      end
    end

    describe "incorrect_case, complete blackout" do
      it "should return right success? and message" do
        card = create(:card)
        inputed_text = "м"
        result = SuperMemo2.new(card, 0).check_translation(inputed_text)
        expect(result.success?).to eq(false)
        expect(result.message).to eq(
          I18n.t("compare_result.not_right",
            text: card[:original_text].mb_chars.upcase)
        )
      end

      it "the first attempt" do
        card = create(:card)
        SuperMemo2.new(card, 0).check_translation("м")
        expect(card[:current_step]).to eq(1)
        expect(card[:e_factor]).to eq(1.7)
        expect(card[:review_date]).to eq(1.day.from_now)
      end

      it "the second attempt" do
        card = create(:card)
        2.times{ SuperMemo2.new(card, @BEFORE_HESITATION).check_translation("м") }
        expect(card[:current_step]).to eq(1)
        expect(card[:e_factor]).to eq(1.3)
        expect(card[:review_date]).to eq(1.day.from_now)
      end

      it "the third attempt" do
        card = create(:card)
        3.times{ SuperMemo2.new(card, @BEFORE_HESITATION).check_translation("м") }
        expect(card[:current_step]).to eq(1)
        expect(card[:e_factor]).to eq(1.3)
        expect(card[:review_date]).to eq(1.day.from_now)
      end
    end
  end
end
