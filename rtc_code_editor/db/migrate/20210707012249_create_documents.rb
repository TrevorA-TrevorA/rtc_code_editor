class CreateDocuments < ActiveRecord::Migration[6.1]
  def change
    create_table :documents, id: :uuid do |t|
      t.string :file_name, null: false
      t.binary :content
      t.references :room, foreign_key: true, type: :uuid
      t.references :admin, foreign_key: { to_table: :users }, type: :uuid
      t.timestamps
    end
  end
end
