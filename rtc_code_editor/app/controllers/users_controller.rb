# frozen_string_literal: true
require 'base64'

class UsersController < ApplicationController
  before_action :confirm_logged_in, except: [
    :new, 
    :create, 
    :request_password_reset, 
    :update_password_form,
    :update_password
  ]

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

  def request_password_reset
    email = Base64.urlsafe_decode64(params[:encoded_email])
    @user = User.find_by(email: email)
    if !@user
      render json: { status:400, message: 'Email not associated with an account' }
      return
    end

    @user.set_password_reset_token
    @user.set_password_reset_time
    UserMailer.password_reset(@user).deliver_now
    render json: { status: 200 }
  end

  def update_password
    puts user_params
    password = user_params[:password]
    confirmation = user_params[:password_confirmation]
    @token = user_params[:password_reset_token]
    
    if !@token
      render status: 401
    elsif password != confirmation
      render status: 400, json: { error: 'password and confirmation do not match' }
    elsif password.length < 8
      render status: 400, json: { error: 'password must be at least eight characters' }
    else
      @user = User.find_by(password_reset_token: @token)
      new_digest = BCrypt::Password.create(password)
      @user.update(password_digest: new_digest, password_reset_token: nil, password_reset_time: nil)
      UserMailer.confirm_password_change(@user).deliver_now
      render status: 200, json: { message: 'update successful' }
    end
  end

  def update_password_form
    user = User.find(params[:id])
    if !user.password_reset_token || !user.validate_password_reset_time
      render 'user_mailer/expired_link_error'
    else
      @password_reset_token = user.password_reset_token
    end
  end

  def destroy
    @user = User.find_by(id: params[:id])
    if @user
      @user.destroy
      render status: 200, json: {status: 200}
    else
      render status: 400, json: {status: 400}
    end
  end

  private

  def user_params
    params.require(:user)
    .permit(:username, 
    :email, 
    :password, 
    :password_confirmation, 
    :password_reset_token)
  end
end
