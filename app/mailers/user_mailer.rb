class UserMailer < ActionMailer::Base
  default :from => "support@timecards.io"
  
  def expire_email(user)
    mail(:to => user.email, :subject => "Your Timecards.io Subscription Cancelled")
  end

  def trial_ending_soon(user)
    mail(:to => user.email, :subject => "Your Timecards.io Trial Is Ending Soon")
  end

  def activated_email(user)
    mail(:to => user.email, :subject => "Your Timecards.io was paid")
  end

  def de_activated_email(user)
    mail(:to => user.email, :subject => "Your Timecards.io is at risk of expiring")
  end
end