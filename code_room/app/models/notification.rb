class Notification < ApplicationRecord
  validates_presence_of :recipient_id, :notification_type
  validates_inclusion_of :read? in: [true, false]

  belongs_to :recipient,
  class_name: 'User',
  primary_key: :id,
  foreign_key: :recipient_id
end