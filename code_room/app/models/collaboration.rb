class Collaboration < ApplicationRecord
  validates_presence_of :editor_id, :document_id
  validates_inclusion_of :accepted, in: [true, false]

  belongs_to :editor,
  class_name: 'User',
  foreign_key: :editor_id

  belongs_to :document,
  class_name: 'Document',
  foreign_key: :document_id
end