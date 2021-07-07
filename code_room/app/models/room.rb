# frozen_string_literal: true

class Room < ApplicationRecord
  validates_presence_of :name, :admin_id

  belongs_to :admin,
             class_name: 'User',
             foreign_key: :admin_id,
             primary_key: :id

  has_many :documents,
           class_name: 'Document',
           foreign_key: :admin_id,
           primary_key: :id,
           dependent: :destroy
end
