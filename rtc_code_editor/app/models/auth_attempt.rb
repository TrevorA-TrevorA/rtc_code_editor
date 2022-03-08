class AuthAttempt < ApplicationRecord
  validates_presence_of :ip_address, :last_attempt_time, :attempt_total
end
