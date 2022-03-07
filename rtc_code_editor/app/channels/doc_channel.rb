class DocChannel < ApplicationCable::Channel
  def subscribed
    stream_from "doc_channel_#{params[:document_id]}"
    @user = connection.current_user
    if params[:editing]
      send_join_request
      announce_arrival
    end

    send_initial_state
  end

  def receive(data)
    ActionCable.server.broadcast("doc_channel_#{params[:document_id]}", data)
  end

  def unsubscribed
    if params[:editing]
      remove_location
      announce_departure
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

  def send_initial_state
    syncRequest = { sender_id: connection.current_user.id, sync: true }
    ActionCable.server.broadcast("doc_channel_#{params[:document_id]}", syncRequest)
  end

  def announce_arrival
    puts "@user: #{@user}"
    user_data = @user.attributes.slice('id', 'avatar_url', 'username', 'email')
    ActionCable.server.broadcast("doc_channel_#{params[:document_id]}", {arrival: user_data})
  end

  def announce_departure
    ActionCable.server.broadcast("doc_channel_#{params[:document_id]}", {departure: @user.id})
  end
end
