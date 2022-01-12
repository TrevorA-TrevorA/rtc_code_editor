class UserMailer < ApplicationMailer
  def password_reset(user)
    @user = user
    mail to: user.email, subject: "Password Reset"
  end

  def confirm_password_change(user)
    mail to: user.email, subject: "Password Change Confirmation"
  end
end
