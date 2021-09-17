class DocChannel < ApplicationCable::Channel
  def subscribed
    stream_from "doc_channel"
  end

  def receive(data)
    ActionCable.server.broadcast("doc_channel", data)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
