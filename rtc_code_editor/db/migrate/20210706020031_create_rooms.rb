class CreateRooms < ActiveRecord::Migration[6.1]
  def change
    create_table :rooms, id: :uuid do |t|
      t.string :name, null: false
      t.references :admin, foreign_key: { to_table: :users }, type: :uuid, null: false 
      t.integer :collabs, array: true
      t.timestamps
    end
  end
end
