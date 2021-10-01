class CreateNotifications < ActiveRecord::Migration[6.1]
  def change
    create_table :notifications do |t|
      t.boolean :read?, default: false, null: false
      t.string :notification_type, null: false
      t.references :recipient, foreign_key: { to_table: :users }, null: false, type: :uuid
      t.references :document, foreign_key: true, type: :uuid
      t.timestamps
    end
  end
end
