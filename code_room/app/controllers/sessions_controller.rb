# frozen_string_literal: true

class SessionsController < ApplicationController
  def new; end

  def create
    email = session_params[:email]
    password = session_params[:password]
    @user = User.find_by_credentials(email, password)
    if @user
      log_in(@user)
      redirect_to user_url(@user)
    else
      flash.now[:error] = 'Log-in unsuccessful'
      render :new
    end
  end

  def destroy
    log_out(current_user)
    redirect_to new_session_url
  end

  private

  def session_params
    params.require(:user).permit(:email, :password)
  end
end
