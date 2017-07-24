class CreateDecks < ActiveRecord::Migration[5.1]
  def change
    create_table :decks do |t|
      t.string :name
      t.boolean :current

      t.timestamps
    end

    add_reference :decks, :user, index: true, foreign_key: true
    remove_reference :cards, :user, index: true, foreign_key: true
    add_reference :cards, :deck, index: true, foreign_key: true
  end
end
