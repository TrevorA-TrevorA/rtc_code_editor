class Collaboration < ApplicationRecord
  validates_presence_of :editor_id, :document_id

  belongs_to :editor,
  class_name: 'User',
  foreign_key: :editor_id

  belongs_to :document,
  class_name: 'Document',
  foreign_key: :document_id
end