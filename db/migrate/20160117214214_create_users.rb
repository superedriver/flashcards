class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :email
      t.string :password

      t.timestamps
    end

    add_reference :cards, :user, index: true, foreign_key: true
  end
end
