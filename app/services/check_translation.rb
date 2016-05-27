class CheckTranslation
  LAITNER = [0, 12.hours, 3.days, 1.week, 2.weeks, 1.month]

  Result = Struct.new(:status, :message) do
    def success?
      status == :ok
    end
  end

  def initialize(card)
    @card = card
  end

  def check_translation?(inputed_text)
    if @card[:original_text].mb_chars.downcase == inputed_text.mb_chars.downcase
      self.correct_answer
      Result.new(:ok, I18n.t("compare_result.right"))
    else
      self.incorrect_answer
      Result.new(:error, I18n.t("compare_result.not_right", text: @card[:original_text].mb_chars.upcase ))
    end
  end

  def get_review_date(current_step)
    Time.now + LAITNER[current_step]
  end

  def correct_answer
    @card[:attempts_count] = 0
    @card[:current_step] += 1 if @card[:current_step] < 5
    @card[:review_date] = get_review_date(@card[:current_step])
    @card.save
  end

  def incorrect_answer
    @card[:attempts_count] += 1
    if @card[:attempts_count] >= 3
      @card[:attempts_count] = 0
      @card[:current_step] -= 2
      @card[:current_step] = 0 if @card[:current_step] < 0
    end

    @card[:review_date] = get_review_date(@card[:current_step])
    @card.save
  end
end