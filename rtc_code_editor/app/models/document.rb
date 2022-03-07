# frozen_string_literal: true
require 'zlib'

class Document < ApplicationRecord
  validates_presence_of :file_name, :admin_id
  validates :file_name, uniqueness: { scope: :admin_id,
  message: "already exists" }
  validate :does_not_exceed_max
  before_save :compress_content
  belongs_to :admin,
             class_name: 'User',
             foreign_key: :admin_id,
             primary_key: :id

  has_many :collaborations,
  class_name: 'Collaboration',
  foreign_key: :document_id,
  primary_key: :id,
  dependent: :destroy

  has_many :accepted_collaborations, -> { accepted },
  class_name: 'Collaboration',
  foreign_key: :document_id,
  primary_key: :id

  has_many :editors,
  through: :accepted_collaborations,
  source: :editor

  def decompress!
    decompressed = Zlib::Inflate.inflate(self.content)
    self.content = decompressed
  end

  private

  def compress_content
    return if already_compressed?
    self.content = Zlib::Deflate.deflate(self.content)
  end

  def already_compressed?
    return false if !self.persisted?
    return false if self.content != Document.find(self.id).content
    true
  end

  def does_not_exceed_max
    admin = User.find(self.admin_id)
    docs = self.persisted? ? 
    admin._documents.reject { |doc| doc.id == self.id } : 
    admin._documents
    current_total_bytes = docs.pluck(:size).sum
    if current_total_bytes + self.size > 5000000
      errors.add :base, "Total uploaded files cannot exceed 50MB"
    end
  end
end
