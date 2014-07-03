Stripe.api_key = ENV["STRIPE_API_KEY"] || 'fake-api-key-for-testing'
STRIPE_PUBLIC_KEY = ENV["STRIPE_PUBLIC_KEY"] || 'fake-api-key-for-testing'

StripeEvent.setup do
  subscribe 'customer.subscription.deleted' do |event|
    Tenant.all.each do |tenant|
      tenant.scope_schema do
        user = User.find_by_customer_id(event.data.object.customer)
        if !user.nil?
          user.expire
          break
        end
      end
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
      Tenant.all.each do |tenant|
        tenant.scope_schema do
          user = User.find_by_customer_id(event.data.object.customer)
          if !user.nil?
            user.de_activate
            break
          end
        end
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
    Tenant.all.each do |tenant|
      tenant.scope_schema do
        user = User.find_by_customer_id(event.data.object.customer)
        if !user.nil?
          user.warn
          break
        end
      end
    end
  end



end