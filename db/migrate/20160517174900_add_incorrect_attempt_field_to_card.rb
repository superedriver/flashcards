class AddIncorrectAttemptFieldToCard < ActiveRecord::Migration[5.1]
  def change
    add_column :cards, :attempts_count, :integer
  end
end
