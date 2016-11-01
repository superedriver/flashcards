class AddMailReminderToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :remind_email, :boolean
  end
end
