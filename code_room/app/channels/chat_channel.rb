class ChatChannel < ApplicationCable::Channel
  
  def subscribed
    stream_from "chat_channel"
  end

  def receive(data)
    ActionCable.server.broadcast("chat_channel", data)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
