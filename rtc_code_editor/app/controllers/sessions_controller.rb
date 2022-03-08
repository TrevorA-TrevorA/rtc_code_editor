# frozen_string_literal: true

class SessionsController < ApplicationController
  def create
    @auth_attempt = AuthAttempt.find_by(ip_address: request.remote_ip)

    if ip_blocked?
      render status: 403, json: { error: "you are temporarily blocked" }
      return
    end

    email = session_params[:email]
    password = session_params[:password]
    @user = User.find_by_credentials(email, password)
    if @user
      clear_failed_auth_attempts
      log_in(@user)
      render "api/users/show"
    else
      record_failed_attempt
      render status: 401, json: { error: "Your username or password is invalid." }
    end
  end

  def destroy
    log_out(current_user)
  end

  private

  def session_params
    params.require(:user).permit(:email, :password)
  end

  def ip_blocked?
    return false if !@auth_attempt
    max_attempts = @auth_attempt.attempt_total == 5
    too_recent = @auth_attempt.last_attempt_time > Time.now - 1.hour
    max_attempts && too_recent
  end

  def record_failed_attempt
    if !@auth_attempt
      AuthAttempt.create(
          ip_address:request.remote_ip,
          last_attempt_time: Time.now,
          attempt_total: 1
        )
      return
    end

    too_recent = @auth_attempt.last_attempt_time > Time.now - 1.hour
    too_recent ? @auth_attempt.attempt_total += 1 : @auth_attempt.attempt_total = 1
    @auth_attempt.last_attempt_time = Time.now
    @auth_attempt.save
  end

  def clear_failed_auth_attempts
    return if !@auth_attempt
    return if @auth_attempt.last_attempt_time > Time.now - 1.hour
    @auth_attempt.destroy
  end
end
