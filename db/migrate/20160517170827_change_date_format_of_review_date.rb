class ChangeDateFormatOfReviewDate < ActiveRecord::Migration[5.1]
  def change
    change_column :cards, :review_date, :datetime
  end
end
