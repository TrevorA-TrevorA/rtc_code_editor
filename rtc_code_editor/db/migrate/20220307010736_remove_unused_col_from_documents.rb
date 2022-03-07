class RemoveUnusedColFromDocuments < ActiveRecord::Migration[6.1]
  def change
    remove_column :documents, :pending_revisions
  end
end
