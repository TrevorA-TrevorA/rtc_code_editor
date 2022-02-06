class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    enable_extension 'pgcrypto'
    create_table :users, id: :uuid do |t|
      t.string :username, null: false
      t.string :password_digest, null: false
      t.string :email, null: false
      t.integer :friends, array: true, default: []
      t.index :email, unique: true
      t.timestamps
    end
  end
end
