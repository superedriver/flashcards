class AddMailReminderToUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :remind_email, :boolean
  end
end
