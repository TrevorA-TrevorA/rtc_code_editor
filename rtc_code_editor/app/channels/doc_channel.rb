class DocChannel < ApplicationCable::Channel
  def subscribed
    stream_from "doc_channel_#{params[:document_id]}"
    if params[:editing]
      doc_connection_params = { 
        editor_id: connection.current_user.id, 
        document_id: params[:document_id]
      }
      
      DocumentConnection.where(doc_connection_params).destroy_all
      @doc_connection = DocumentConnection.create(doc_connection_params)
      send_initial_state
      send_join_request
    end

    broadcast_active_editors
  end

  def receive(data)
    ActionCable.server.broadcast("doc_channel_#{params[:document_id]}", data)
  end

  def unsubscribed
    if @doc_connection
      @doc_connection.destroy
    else
      doc_connection_params = { 
        editor_id: connection.current_user.id, 
        document_id: params[:document_id]
      }
      
      DocumentConnection.where(doc_connection_params).destroy_all
    end
    
    if params[:editing]
      remove_location
      broadcast_active_editors
    end
  end

  private

  def remove_location
    signal = { 
      exit: true, 
      senderId: connection.current_user.id, 
      senderName: connection.current_user.username 
    }
    ActionCable.server.broadcast("doc_channel_#{params[:document_id]}", signal)
  end

  def send_join_request
    signal = { join: true, senderId: connection.current_user.id }
    ActionCable.server.broadcast("doc_channel_#{params[:document_id]}", signal)
  end

  def broadcast_active_editors
    editors = DocumentConnection.where(document_id: params[:document_id])
    .map do |conn|
      User.find(conn.editor_id)
      .attributes
      .slice('id', 'username', 'avatar_url', 'email')
    end

    ActionCable.server.broadcast("doc_channel_#{params[:document_id]}", {editors: editors})
  end

  def send_initial_state
    if DocumentConnection.where(document_id: params[:document_id]).length == 1
      doc = Document.find(params[:document_id])
      file_name = doc.file_name
      content = doc.content
      document = { content: content, file_name: file_name }

      ActionCable.server.broadcast("doc_channel_#{params[:document_id]}", { document: document })
      return
    end

    syncRequest = { sender_id: connection.current_user.id, sync: true }
    ActionCable.server.broadcast("doc_channel_#{params[:document_id]}", syncRequest)
  end
end