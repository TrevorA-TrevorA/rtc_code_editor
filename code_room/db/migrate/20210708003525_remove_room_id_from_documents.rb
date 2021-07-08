class RemoveRoomIdFromDocuments < ActiveRecord::Migration[6.1]
  def change
    remove_reference :documents, :room, foreign_key: true
  end
end
