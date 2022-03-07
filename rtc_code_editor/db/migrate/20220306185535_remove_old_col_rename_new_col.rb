class RemoveOldColRenameNewCol < ActiveRecord::Migration[6.1]
  def change
    remove_column :documents, :content
    rename_column :documents, :compress_content, :content
  end
end
