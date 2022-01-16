class AddPendingRevisionToDocuments < ActiveRecord::Migration[6.1]
  def change
    add_column :documents, :pending_revisions, :text
  end
end
