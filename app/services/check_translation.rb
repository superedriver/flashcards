class CheckTranslation

  Result = Struct.new(:success?, :message)

  def initialize(card)
    @LAITHER = [0, 12.hours, 3.days, 1.week, 2.weeks, 1.month]
    @card = card
  end

  def check_translation?(inputed_text)
    if @card[:original_text].mb_chars.downcase == inputed_text.mb_chars.downcase
      self.correct_answer
      Result.new(true, I18n.t("compare_result.right"))
    else
      self.incorrect_answer
      Result.new(false, I18n.t("compare_result.not_right", text: @card[:original_text].mb_chars.upcase ))
    end
  end

  def success?(current_step)
    Time.now + @LAITHER[current_step]
  end

  def get_review_date(current_step)
    Time.now + @LAITHER[current_step]
  end

  def correct_answer
    @card[:attempts_count] = 0
    @card[:current_step] += 1 if @card[:current_step] < 5
    @card[:review_date] = get_review_date(@card[:current_step])
    @card.update(
        attempts_count: @card[:attempts_count],
        current_step: @card[:current_step],
        review_date: @card[:review_date]
    )
  end

  def incorrect_answer
    @card[:attempts_count] += 1
    if @card[:attempts_count] >= 3
      @card[:attempts_count] = 0
      @card[:current_step] -= 2
      @card[:current_step] = 0 if @card[:current_step] < 0
    end

    @card[:review_date] = get_review_date(@card[:current_step])
    @card.update(
        attempts_count: @card[:attempts_count],
        current_step: @card[:current_step],
        review_date: @card[:review_date]
    )
  end
end