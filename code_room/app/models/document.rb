# frozen_string_literal: true

class Document < ApplicationRecord
  validates_presence_of :file_name, :admin_id, :room_id

  belongs_to :admin,
             class_name: 'User',
             foreign_key: :admin_id,
             primary_key: :id

  belongs_to :room,
             class_name: 'Room',
             foreign_key: :room_id,
             primary_key: :id
end
