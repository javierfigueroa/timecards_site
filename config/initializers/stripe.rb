Stripe.api_key = ENV["STRIPE_API_KEY"] || 'fake-api-key-for-testing'
STRIPE_PUBLIC_KEY = ENV["STRIPE_PUBLIC_KEY"] || 'fake-api-key-for-testing'

StripeEvent.setup do
  subscribe 'customer.subscription.deleted' do |event|
    user = User.find_by_customer_id(event.data.object.customer)
    user.expire
  end

  subscribe 'customer.created' do |event|
    Rails.logger.info '**************************************************'
    Rails.logger.info event
    Rails.logger.info '**************************************************'
    render :status => :ok
  end

  subscribe 'invoice.payment_failed' do |event|
    Rails.logger.info '**************************************************'
    Rails.logger.info event
    Rails.logger.info '**************************************************'

    if (event.data.object.delinquent)
      user = User.find_by_customer_id(event.data.object.customer)
      user.de_activate
    end
  end

  subscribe 'customer.updated' do |event|
    Rails.logger.info '**************************************************'
    Rails.logger.info event
    Rails.logger.info '**************************************************'

    #user = User.find_by_email(event.data.object.email)
    #if (!event.data.object.delinquent)
    #  user.activate
    #end
  end

  subscribe 'customer.subscription.trial_will_end' do |event|
    Rails.logger.info '**************************************************'
    Rails.logger.info event
    Rails.logger.info '**************************************************'

    #send email with notice
    user = User.find_by_customer_id(event.data.object.customer)
    user.warn

  end



end