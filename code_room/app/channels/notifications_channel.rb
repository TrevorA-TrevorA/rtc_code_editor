class NotificationsChannel < ApplicationCable::Channel
  def subscribed
    @notifications = Notification.where(recipient_id: params[:id])
    stream_from "notifications_channel_#{params[:id]}"
    ActionCable.server.broadcast("notifications_channel_#{params[:id]}", { notifications: @notifications })
  end

  def receive(data)
    @notification = Notification.create(data)
    ActionCable.server.broadcast("notifications_channel_#{data["recipient_id"]}", { new_notification: @notification })
  end
end
