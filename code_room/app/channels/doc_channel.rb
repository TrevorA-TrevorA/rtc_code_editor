class DocChannel < ApplicationCable::Channel
  def subscribed
    stream_from "doc_channel_#{params[:document_id]}"
    doc_connection_params = { 
      editor_id: connection.current_user.id, 
      document_id: params[:document_id]
    }
    
    DocumentConnection.where(doc_connection_params).destroy_all
    @doc_connection = DocumentConnection.create(doc_connection_params)
    broadcast_active_editors
    send_edit_notification
  end

  def receive(data)
    ActionCable.server.broadcast("doc_channel_#{params[:document_id]}", data)
  end

  def unsubscribed
    @doc_connection.destroy
    broadcast_active_editors
  end

  private

  def broadcast_active_editors
    editors = DocumentConnection.where(document_id: params[:document_id])
    .map do |conn|
      User.find(conn.editor_id)
      .attributes
      .slice('id', 'username', 'avatar_url', 'email')
    end

    ActionCable.server.broadcast("doc_channel_#{params[:document_id]}", {editors: editors})
  end

  def send_edit_notification
    details = {  document_id: params[:document_id], action: "open channel" }
    notif_params = { notification_type: "edit_activity", details: details }
    admin_id = Document.find(params[:document_id]).admin_id

    if connection.current_user.id != admin_id
      notif_params[:recipient_id] = admin_id
      notif = Notification.create(notif_params)
      ActionCable.server.broadcast("notifications_channel_#{admin_id}", { edit_activity: [notif] })
    end

    Collaboration.where(document_id: params[:document_id]).each do |coll|
      next if coll.editor_id == connection.current_user.id
      notif_params[:recipient_id] = coll.editor_id
      notif = Notification.create(notif_params)
      ActionCable.server.broadcast("notifications_channel_#{coll.editor_id}", { edit_activity: [notif] })
    end
  end
end
