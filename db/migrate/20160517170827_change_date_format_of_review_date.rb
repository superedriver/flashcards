class ChangeDateFormatOfReviewDate < ActiveRecord::Migration
  def change
    change_column :cards, :review_date, :datetime
  end
end
