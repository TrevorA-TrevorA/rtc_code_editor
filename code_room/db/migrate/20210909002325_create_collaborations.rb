class CreateCollaborations < ActiveRecord::Migration[6.1]
  def change
    create_table :collaborations, id: :uuid do |t|
      t.references :editor, foreign_key: { to_table: :users }, null: false, type: :uuid
      t.references :document, foreign_key: true, null: false, type: :uuid
      t.timestamps
    end
  end
end
