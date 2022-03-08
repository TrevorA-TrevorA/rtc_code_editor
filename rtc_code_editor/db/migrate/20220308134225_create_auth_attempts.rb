class CreateAuthAttempts < ActiveRecord::Migration[6.1]
  def change
    create_table :auth_attempts do |t|
      t.string :ip_address, null: false
      t.datetime :last_attempt_time, precision: 6, null: false
      t.integer :attempt_total, default: 0
      t.timestamps
    end
  end
end
