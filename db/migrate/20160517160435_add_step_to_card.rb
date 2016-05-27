class AddStepToCard < ActiveRecord::Migration
  def change
    add_column :cards, :current_step, :integer
  end
end
