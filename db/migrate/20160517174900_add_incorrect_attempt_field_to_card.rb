class AddIncorrectAttemptFieldToCard < ActiveRecord::Migration
  def change
    add_column :cards, :attempts_count, :integer
  end
end
