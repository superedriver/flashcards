class AddImageToCard < ActiveRecord::Migration
  def change
    add_column :cards, :image, :string
  end
end
