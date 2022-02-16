class NotificationsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "notifications_channel_#{params[:id]}"
  end

  def receive(data)
    if data["notification_type"] == "collaboration_acceptance"
      document_id = data["details"]["document_id"]
      recipient_id = Document.find(document_id).admin_id
      data["recipient_id"] = recipient_id
      collab_id = data["details"]["collab_id"]
      editor = User.find(data["details"]["editor_id"])
        .attributes
        .slice('id', 'username', 'avatar_url', 'email')
        .merge('collab_id' => collab_id)
      editor_name = editor['username']
      file_name = data["details"]["file_name"]
      message = "#{editor_name}\n has accepted your invitation to edit\n #{file_name}"
      data["details"]["message"] = message
      @notification = Notification.create(data)
      ActionCable.server.broadcast("notifications_channel_#{data["recipient_id"]}", { new_notification: @notification })
      ActionCable.server.broadcast("editors_channel_#{document_id}", { new_editor: editor })
      return
    end
    
    if data["notification_type"] == "rescind"
      @notification = Notification.where("details @> hstore(:key, :value)",
      key: "document_id", value: data["details"]["document_id"]
    ).where(recipient_id: data["recipient_id"]).first

      @notification.destroy
      
      ActionCable.server.broadcast("notifications_channel_#{data["recipient_id"]}", { rescind: @notification })
      return
    end

    @notification = Notification.create(data)
    ActionCable.server.broadcast("notifications_channel_#{data["recipient_id"]}", { new_notification: @notification })
  end
end
