class AddFileSizeToDocuments < ActiveRecord::Migration[6.1]
  def change
    add_column :documents, :size, :float, null:false
  end
end
