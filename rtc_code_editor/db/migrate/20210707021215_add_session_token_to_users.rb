class AddSessionTokenToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :session_token, :string, null: false
  end
end
