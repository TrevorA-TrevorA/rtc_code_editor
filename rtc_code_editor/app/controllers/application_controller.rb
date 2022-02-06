# frozen_string_literal: true

class ApplicationController < ActionController::Base
  skip_before_action :verify_authenticity_token
  helper_method :current_user

  def log_in(user)
    session[:session_token] = user.session_token
  end

  def log_out(user)
    return if !user
    user.reset_session_token
    session[:session_token] = nil
  end

  def current_user
    User.find_by(session_token: session[:session_token])
  end

  def destroy_collaborations(collaborations)
    collaborations.each do |col|
      notification_data = {
        recipient_id: col.editor_id,
        notification_type: "deletion_notice",
        details: { 
          document_id: col.document_id, 
          collaboration_id: col.id,
          message: "#{Document.find(col.document_id).file_name} has been deleted."
        }
      }
      notification = Notification.create(notification_data);
      ActionCable.server.broadcast("notifications_channel_#{col.editor_id}", { new_notification: notification })
    end
  end

  private

  def confirm_logged_in
    unless current_user
      render status: 401, json: nil
    end
  end
end
