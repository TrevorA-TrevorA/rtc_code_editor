class DropDocumentConnectionTable < ActiveRecord::Migration[6.1]
  def change
    drop_table(:document_connections)
  end
end
