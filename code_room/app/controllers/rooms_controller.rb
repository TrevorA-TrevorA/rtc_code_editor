# frozen_string_literal: true

class RoomsController < ApplicationController
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
    else
      render status: 404
    end
  end

  def show
    @room = Room.find_by(id: params[:id])

    if @room
      render json: @room
    else
      render status: 404
    end
  end
end
