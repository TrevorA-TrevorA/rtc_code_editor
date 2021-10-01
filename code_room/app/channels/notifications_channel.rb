class NotificationsChannel < ApplicationCable::Channel
  def subscribed
    @notifications = Notification.where(recipient_id: current_user.id)
    ActionCable.server.broadcast("notifications_#{current_user.id}", @notifications)
  end

  def receive(data)
    @notification = Notification.create(data)
    ActionCable.server.broadcast("notifications_#{data.recipient_id}", @notification)
  end
end
