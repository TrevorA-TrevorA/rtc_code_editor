# frozen_string_literal: true

class Document < ApplicationRecord
  validates_presence_of :file_name, :admin_id

  belongs_to :admin,
             class_name: 'User',
             foreign_key: :admin_id,
             primary_key: :id

  has_many :collaborations,
  class_name: 'Collaboration',
  foreign_key: :document_id,
  primary_key: :id,
  dependent: :destroy

  has_many :editors,
  through: :collaborations,
  source: :user
end
