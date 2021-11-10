class CreateDocumentConnections < ActiveRecord::Migration[6.1]
  def change
    create_table :document_connections do |t|
      t.references :editor, type: :uuid, null: false, foreign_key: { to_table: :users }
      t.references :document, type: :uuid, null: false
      t.timestamps
    end
  end
end
