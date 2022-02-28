class NotificationsController < ApplicationController
  before_action :confirm_logged_in
  
  def create
    @notification = Notification.new(notification_params)

    if @notification.save
      render json: { status: 201 }
    else
      render json: { status: 400 }
    end
  end

  def index
    @notifications = Notification.where(recipient_id: params[:user_id])
    render json: @notifications
  end
  
  def destroy
    @notification = Notification.find(params[:id])

    if !@notification
      render json: { status: 404 }
    else
      @notification.destroy
    end
  end

  def destroy_all
    @notifications = Notification.where(recipient_id: params[:user_id]);

    @notifications
    .where(notification_type: "collaboration_request")
    .each do |coll_req|
      destroy_unreferenced_collab(coll_req)
    end

    @notifications.destroy_all;
  end
  
  def update
    @notification = Notification.find(params[:id])
    @notification.update(read: true)
  end

  def update_all
    @notifications = Notification.where(recipient_id: params[:user_id])
     if @notifications.update_all(read: true)
      puts @notifications
      render json: @notifications
     else
      render status: 400, json: { status: 400 }
     end
  end
end

private

def destroy_unreferenced_collab(notification)
  return if notification.notification_type != "collaboration_request"
  collab = Collaboration.find(notification.details["collaboration_id"])
  collab.destroy unless collab.accepted
end
