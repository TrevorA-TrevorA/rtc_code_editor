class NotificationsController < ApplicationController
  def create
    @notification = Notification.new(notification_params)

    if @notification.save
      render json: { status: 201 }
    else
      render json: { status: 400 }
    end
  end
  
  
  def destroy
    @notification = Notification.find(params[:id])

    if @notification
      @notification.destroy
    else
      render json: { status: 404 }
    end
  end

  def destroy_all
    @notifications = Notification.where(recipient_id: params[:user_id]);
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
