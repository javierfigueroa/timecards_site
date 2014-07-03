Stripe.api_key = ENV["STRIPE_API_KEY"] || 'fake-api-key-for-testing'
STRIPE_PUBLIC_KEY = ENV["STRIPE_PUBLIC_KEY"] || 'fake-api-key-for-testing'

StripeEvent.setup do
  subscribe 'customer.subscription.deleted' do |event|
    user = find_user(event)
    unless user.nil?
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
      unless user.nil?
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
    unless user.nil?
      user.warn
    end
  end


  def find_user(event)
    Tenant.all.each do |tenant|
      tenant.scope_schema do
        user = User.where("customer_id = ? AND tenant_id = ?", event.data.object.customer, tenant.id).first
        unless user.nil?
          Rails.logger.info user.email
          return user
        end
      end
    end

    return nil
  end

end