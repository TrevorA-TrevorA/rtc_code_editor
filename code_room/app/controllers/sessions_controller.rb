# frozen_string_literal: true

class SessionsController < ApplicationController
  def create
    email = session_params[:email]
    password = session_params[:password]
    @user = User.find_by_credentials(email, password)
    if @user
      log_in(@user)
      render "api/users/show"
    else
      render status: 400, json: nil
    end
  end

  def destroy
    log_out(current_user)
  end

  private

  def session_params
    params.require(:user).permit(:email, :password)
  end
end
