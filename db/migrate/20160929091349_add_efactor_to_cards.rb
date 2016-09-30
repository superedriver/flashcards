class AddEfactorToCards < ActiveRecord::Migration
  def change
    remove_column :cards, :attempts_count, :integer
    add_column :cards, :e_factor, :float
    add_column :cards, :last_interval, :float
  end
end
