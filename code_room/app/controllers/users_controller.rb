# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :confirm_logged_in, except: [:new, :create]

  def index
    pattern = params[:q]

    @users = User.where("username ILIKE ?", "%#{pattern}%")
    if @users
      render "api/users/index"
    else
      render status: 404
    end
  end

  def show
    @user = User.find_by(id: params[:id])

    if @user
      render :show
    else
      render status: 404
    end
  end

  def new
    @user = User.new
  end

  def create
    if User.find_by(email: user_params[:email])
      render status: 400, json: { error: "User with this email already exists" }
      return
    end
    
    @user = User.new(user_params)
    if @user.save
      log_in(@user)
      render "api/users/show"
    else
      render status: 400
      return
    end
  end

  def update
    @user = User.find_by(id: params[:id])
    avatar_url = params[:avatar_url]

    if @user.update(avatar_url: avatar_url)
      render json: {avatar_url: avatar_url}
    else
      render json: { status: 400 }, status: 400
    end
  end

  def destroy
    @user = User.find_by(id: params[:id])
    @user.destroy
    render status: 200
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation)
  end
end
