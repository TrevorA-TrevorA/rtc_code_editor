class ChatChannel < ApplicationCable::Channel
  
  def subscribed
    @user = connection.current_user
    stream_from "chat_channel_#{params[:document_id]}"
    arrival_message = { senderId: @user.id }
    message = "#{@user.username} has arrived."
    arrival_message[:headerMessage] = message;
    ActionCable.server.broadcast("chat_channel_#{params[:document_id]}", arrival_message)
  end

  def receive(data)
    ActionCable.server.broadcast("chat_channel_#{params[:document_id]}", data)
  end

  def unsubscribed
    exit_message = { senderId: @user.id }
    message = "#{@user.username} is gone."
    exit_message[:headerMessage] = message;
    ActionCable.server.broadcast("chat_channel_#{params[:document_id]}", exit_message)
  end
end
