module CheckTranslation
  LAITHER = [0, 12.hours, 3.days, 1.week, 2.weeks, 1.month]

  def change_review_date!
    self.update_column(:review_date, Time.now + LAITHER[self[:current_step]])
  end

  def correct_answer
    self[:attempts_count] = 0
    self[:current_step] += 1 if self[:current_step] < 5
    self.change_review_date!
  end

  def incorrect_answer
    self[:attempts_count] += 1
    if self[:attempts_count] >= 3
      self[:attempts_count] = 0
      self[:current_step] -= 2
      self[:current_step] = 0 if self[:current_step] < 0
    end

    self.change_review_date!
  end
end