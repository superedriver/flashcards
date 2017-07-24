class AddStepToCard < ActiveRecord::Migration[5.1]
  def change
    add_column :cards, :current_step, :integer
  end
end
