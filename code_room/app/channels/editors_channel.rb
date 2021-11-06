class EditorsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "editors_channel_#{params[:document_id]}"
    @editors = Collaboration.where(document_id: params[:document_id], accepted: true)
    .map do |collab|
      User.find(collab.editor_id)
      .attributes
      .slice('id', 'username', 'avatar_url', 'email')
      .merge('collab_id' => collab.id)
    end
    
    editor_info = { editors: @editors }
    if !params[:admin]
      document = Document.find(params[:document_id])
      editor_info[:admin] = User.find(document.admin_id)
    end

    ActionCable.server.broadcast("editors_channel_#{params[:document_id]}", editor_info)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
