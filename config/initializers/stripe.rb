Stripe.api_key = ENV["STRIPE_API_KEY"] || 'fake-api-key-for-testing'
STRIPE_PUBLIC_KEY = ENV["STRIPE_PUBLIC_KEY"] || 'fake-api-key-for-testing'

StripeEvent.setup do |events|
  subscribe 'customer.subscription.deleted' do |event|
    user = User.find_by_customer_id(event.data.object.customer)
    user.expire
  end

  subscribe 'customer.created' do |event|
    Rails.logger.info '**************************************************'
    Rails.logger.info event
    Rails.logger.info '**************************************************'
  end
end