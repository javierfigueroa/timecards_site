Stripe.api_key = ENV["STRIPE_API_KEY"] || 'fake-api-key-for-testing'
STRIPE_PUBLIC_KEY = ENV["STRIPE_PUBLIC_KEY"] || 'fake-api-key-for-testing'

StripeEvent.setup do
  subscribe 'customer.subscription.deleted' do |event|
    user = find_user(event)
    if !user.nil?
      user.expire
    end
  end

  subscribe 'customer.created' do |event|
    Rails.logger.info '********************** customer.created ****************************'
    Rails.logger.info event
    Rails.logger.info '**************************************************'
  end

  subscribe 'invoice.payment_failed' do |event|
    Rails.logger.info '********************* invoice.payment_failed *****************************'
    Rails.logger.info event
    Rails.logger.info '**************************************************'

    if (event.data.object.delinquent)
      user = find_user(event)
      if !user.nil?
        user.de_activate
      end
    end
  end

  subscribe 'customer.updated' do |event|
    Rails.logger.info '********************* customer.updated *****************************'
    Rails.logger.info event
    Rails.logger.info '**************************************************'

    #user = User.find_by_email(event.data.object.email)
    #if (!event.data.object.delinquent)
    #  user.activate
    #end
  end

  subscribe 'customer.subscription.trial_will_end' do |event|
    Rails.logger.info '******************* customer.subscription.trial_will_end *******************************'
    Rails.logger.info event
    Rails.logger.info '**************************************************'

    #send email with notice
    user = find_user(event)
    if !user.nil?
      user.warn
    end
  end


  def find_user(event)
    user = User.find_by_customer_id(event.data.object.customer)
    if !user.nil?
      return user
    end

    Tenant.all.each do |tenant|
      tenant.scope_schema do
        Rails.logger.info User.all
        return User.find_by_customer_id(event.data.object.customer)
      end
    end
  end

end