# frozen_string_literal: true

class ApplicationController < ActionController::Base
  helper_method :current_user

  def log_in(user)
    session[:session_token] = user.session_token
  end

  def log_out(user)
    user.reset_session_token
    session[:session_token] = nil
  end

  def current_user
    User.find_by(session_token: session[:session_token])
  end

  private

  def confirm_logged_in
    redirect_to new_session_url unless current_user
  end
end
