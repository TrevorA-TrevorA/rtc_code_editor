class ChangeReadColumnName < ActiveRecord::Migration[6.1]
  def change
    rename_column :notifications, :read?, :read
  end
end
