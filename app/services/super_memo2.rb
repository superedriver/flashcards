require "levenshtein"

class SuperMemo2
# This class implement a _SuperMemo2_ algorithm.
# See more: http://www.supermemo.com/english/ol/sm2.htm
#
# Algorithm _SM-2_ used in the computer-based variant of the SuperMemo method
# and involving the calculation of easiness factors for particular items:
#
# 1. Split the knowledge into smallest possible items.
# 2. With all items associate an E-Factor equal to 2.5.
# 3. Repeat items using the following intervals:
#     I(1) = 1
#     I(2) = 6
#     for n > 2: I(n) = I(n-1) * EF
#
#    where:
#    *I*(*n*) - inter-repetition interval after the n-th repetition (in days),
#    *EF* - E-Factor of a given item
#    If interval is a fraction, round it up to the nearest integer.
# 4. After each repetition assess the quality of repetition response in 0-5
#    grade scale:
#     5 - perfect response
#     4 - correct response after a hesitation
#     3 - correct response recalled with serious difficulty
#     2 - incorrect response; where the correct one seemed easy to recall
#     1 - incorrect response; the correct one remembered
#     0 - complete blackout.
# 5. After each repetition modify the E-Factor of the recently repeated item
#    according to the formula:
#     E-Factror = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
#    where:
#    *E-Factor* - new value of the E-Factor,
#    *EF* - old value of the E-Factor,
#    *q* - quality of the response in the 0-5 grade scale.
#    If *EF* is less than 1.3 then let EF be 1.3.
# 6. If the quality response was lower than 3 then start repetitions for the
#    item from the beginning without changing the E-Factor (i.e. use intervals
#    I(1), I(2) etc. as if the item was memorized anew).
# 7. After each repetition session of a given day repeat again all items that
#    scored below four in the quality assessment. Continue the repetitions until
#    all of these items score at least fou

  HESITATION_START = 15
  DIFFICULTY_START = 30

  Result = Struct.new(:status, :message) do
    def success?
      status == :ok
    end
  end

  def initialize(card, quality_response)
    @card = card
    @quality_response = quality_response.to_i
  end

  def check_translation(inputed_text)
    distance = Levenshtein.distance(
        @card[:original_text].mb_chars.downcase.to_s,
        inputed_text.mb_chars.downcase.to_s
    )

    case distance
      when 0
        # correct_case
        # 5 - perfect response
        # 4 - correct response after a hesitation
        # 3 - correct response recalled with serious difficulty

        quality = 3
        quality = 5 if @quality_response < HESITATION_START
        quality = 4 if @quality_response >= HESITATION_START && @quality_response <= DIFFICULTY_START
        update_card(quality)
        Result.new(:ok, I18n.t("compare_result.right"))
      when 1
        # misprint_case
        # 2 - incorrect response; where the correct one seemed easy to recall
        quality = 2
        update_card(quality)
        Result.new(
          :error,
          I18n.t(
            "compare_result.misprint",
            correct_text: @card[:original_text].mb_chars.upcase,
            users_text: inputed_text.mb_chars.upcase
          )
        )
      when 2
        # incorrect_case, the correct one remembered
        # 1 - incorrect response; the correct one remembered
        quality = 1
        incorrect_answer(quality)
      else
        # incorrect_case, complete blackout
        # 0 - complete blackout.
        quality = 0
        incorrect_answer(quality)
    end
  end

  private

  def update_card(quality)
    @card[:current_step] += 1
    @card[:current_step] = 1 if quality < 3
    @card[:e_factor] = get_e_factor(@card[:e_factor], quality)
    @card[:review_date] = get_review_date(@card[:current_step], @card[:e_factor])
    @card.save
  end

  def get_review_date(current_step, e_factor)
    case current_step
      when 1
        1.day.from_now
      when 2
        @card[:last_interval] = 6.0
        6.days.from_now
      else
        new_interval = @card[:last_interval] * e_factor
        @card[:last_interval] = new_interval
        new_interval.days.from_now
    end
  end

  def get_e_factor(card_e_factor, card_quality)
    e_factor = (card_e_factor+(0.1-(5-card_quality)*(0.08+(5-card_quality)*0.02))).round(5)
    e_factor = 1.3 if e_factor < 1.3
    e_factor
  end

  def incorrect_answer(quality)
    update_card(quality)
    Result.new(
      :error,
      I18n.t("compare_result.not_right",
             text: @card[:original_text].mb_chars.upcase)
    )
  end
end
