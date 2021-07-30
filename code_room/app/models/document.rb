# frozen_string_literal: true

class Document < ApplicationRecord
  validates_presence_of :file_name, :admin_id

  belongs_to :admin,
             class_name: 'User',
             foreign_key: :admin_id,
             primary_key: :id

  has_one :room,
             class_name: 'Room',
             foreign_key: :document_id,
             primary_key: :id,
             dependent: :destroy
end
