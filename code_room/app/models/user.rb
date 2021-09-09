# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password
  validates_presence_of :email, :username, :session_token
  validates_uniqueness_of :email, :session_token
  validates :password, presence: { on: create }, length: { minimum: 8 }
  after_initialize :ensure_session_token

  has_many :documents,
           class_name: 'Document',
           foreign_key: :admin_id,
           primary_key: :id,
           dependent: :destroy


  def self.find_by_credentials(email, password)
    user = User.find_by(email: email)
    return nil unless user && user.authenticate(password)
    user
  end

  def reset_session_token
    self.session_token = self.class.generate_unique_secure_token
  end  
         
  private

  def ensure_session_token
    self.session_token ||= self.class.generate_unique_secure_token
  end          
end
