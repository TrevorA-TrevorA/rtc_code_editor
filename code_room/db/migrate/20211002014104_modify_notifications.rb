class ModifyNotifications < ActiveRecord::Migration[6.1]
  def change
    enable_extension "hstore"
    remove_column :notifications, :document_id
    add_column :notifications, :details, :hstore
  end
end
