class UserMailer < ApplicationMailer
  def password_reset(user)
    mail :to => user.email, :subject => "Password Reset"
  end
end
