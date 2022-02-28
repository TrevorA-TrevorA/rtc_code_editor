# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password
  validates_presence_of :email, :username, :session_token
  validates_uniqueness_of :email, :session_token
  validates :password, presence: { on: create }, length: { on: create, minimum: 8 }
  after_initialize :ensure_session_token

  has_many :documents,
           class_name: 'Document',
           foreign_key: :admin_id,
           primary_key: :id,
           dependent: :destroy

  has_many :collaborations,
  class_name: 'Collaboration',
  foreign_key: :editor_id,
  primary_key: :id,
  dependent: :destroy

  has_many :collab_documents,
  through: :collaborations,
  source:  :document

  has_many :notifications,
  class_name: 'Notification',
  primary_key: :id,
  foreign_key: :recipient_id

  def accepted_collab_documents
    accepted_cols = self.collaborations.select { |col| col.accepted == true }
    accepted_cols.map { |col| col.document }
  end

  def pending_collab_documents
    accepted_cols = self.collaborations.select { |col| col.accepted == false }
    accepted_cols.map { |col| col.document }
  end


  def self.find_by_credentials(email, password)
    user = User.find_by(email: email)
    return nil unless user && user.authenticate(password)
    user
  end

  def reset_session_token
    self.session_token = self.class.generate_unique_secure_token
  end

  def set_password_reset_token
    self.update(password_reset_token: self.class.generate_unique_secure_token)
  end

  def set_password_reset_time
    self.update(password_reset_time: DateTime.now)
  end

  def validate_password_reset_time
    return DateTime.now - self.password_reset_time.to_datetime <= 1/24.0
  end
         
  private

  def ensure_session_token
    self.session_token ||= self.class.generate_unique_secure_token
  end          
end
