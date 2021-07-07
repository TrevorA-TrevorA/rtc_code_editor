# frozen_string_literal: true

class RoomsController < ApplicationController
  def new; end

  def create
    @room = Room.create(room_params)

    if @room
      render status: 201
    else
      render status: 400
    end
  end

  def delete
    @room = Room.find_by(id: params[:id])

    if @room
      @room.destroy
      redirect_to user_url(currect_user)
    else
      render status: 404
    end
  end

  def edit; end

  def index; end

  def show
    @room = Room.find_by(id: params[:id])

    if @room
      redirect_to room_url(@room)
    else
      render status: 404
    end
  end

  def update; end
end
