# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :confirm_logged_in, except: [:new, :create]

  def show
    @user = User.find_by(id: params[:id])

    render status: 404 unless @user
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      log_in(@user)
      render json: @user
      #redirect_to user_url(@user)
    else
      flash.now[:errors] = @user.errors.full_messages
      render json: { "status": 401 }
      return
    end
  end

  def destroy
    @user = User.find_by(id: params[:id])
    @user.destroy
    redirect_to new_user_url
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation)
  end
end
