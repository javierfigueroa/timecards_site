class UserMailer < ActionMailer::Base
  default :from => "notifications@example.com"
  
  def expire_email(user)
    mail(:to => user.email, :subject => "Subscription Cancelled")
  end

  def trial_ending_soon(user)
    mail(:to => user.email, :subject => "Your Timecards Trial Is Ending Soon")
  end
end