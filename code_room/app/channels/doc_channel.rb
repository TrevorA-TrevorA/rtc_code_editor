class DocChannel < ApplicationCable::Channel
  def subscribed
    stream_from "doc_channel_#{params[:document_id]}"
    doc_connection_params = { 
      editor_id: connection.current_user.id, 
      document_id: params[:document_id] 
    }

    @doc_connection = DocumentConnection.create!(doc_connection_params)
    broadcast_active_editors
  end

  def receive(data)
    ActionCable.server.broadcast("doc_channel_#{params[:document_id]}", data)
  end

  def unsubscribed
    @doc_connection.destroy
    broadcast_active_editors
    # Any cleanup needed when channel is unsubscribed
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
end
