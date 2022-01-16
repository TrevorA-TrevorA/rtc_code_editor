class AddDocumentIdToRooms < ActiveRecord::Migration[6.1]
  def change
    add_reference :rooms, :document, foreign_key: true, type: :uuid, null: false
  end
end
