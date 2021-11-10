class DocumentConnection < ApplicationRecord
  belongs_to :user,
  class_name: 'User',
  foreign_key: :editor_id

  belongs_to :document,
  class_name: 'Document',
  foreign_key: :document_id
end