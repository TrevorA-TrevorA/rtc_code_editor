# frozen_string_literal: true

class SessionsController < ApplicationController
  def create
    email = session_params[:email]
    password = session_params[:password]
    @user = User.find_by_credentials(email, password)
    if @user
      log_in(@user)
      render json: @user
    else
      flash.now[:error] = 'Log-in unsuccessful'
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
