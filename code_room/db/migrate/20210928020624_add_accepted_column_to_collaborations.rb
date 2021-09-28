class AddAcceptedColumnToCollaborations < ActiveRecord::Migration[6.1]
  def change
    add_column :collaborations, :accepted, :boolean, default: false, null: false
  end
end
