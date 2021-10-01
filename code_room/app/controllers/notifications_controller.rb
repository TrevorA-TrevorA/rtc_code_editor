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
  
  def update
    @notification = Notification.find(params[:id])
    @notification.update(read?: true)
  end
end
