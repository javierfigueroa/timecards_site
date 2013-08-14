require 'PgTools'

class User < ActiveRecord::Base
  rolify
  has_many :timecards
  scope :on_dates, ->(in_date, out_date) { where(:id => Timecard.select(:user_id).where('timestamp_in >= ? AND timestamp_out <= ?', in_date, out_date)) }
 
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :token_authenticatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :first_name, :last_name, :email, :password, :password_confirmation, :remember_me, :stripe_token, :company_name, :encrypted_password, :tenant_id
  attr_accessor :stripe_token, :coupon
  before_save :update_stripe
  before_destroy :cancel_subscription
  after_create :create_tenant
  
  def create_tenant
    if tenant_id.nil? && !roles.first.nil? && !roles.first.name.include?("admin")
      tenant = Tenant.find_or_create_by_subdomain(:subdomain => self.company_name)     
      tenant.save!      
      create_admin_in_tenant(tenant)  
    end
  end

  #used to crete first user and admin of the tenant scheme
  def create_admin_in_tenant(tenant)
    user = self
    tenant.scope_schema do
      tenant_admin = User.find_or_create_by_email(
         :first_name => user.first_name, 
         :last_name => user.last_name,   
         :email => user.email, 
         :encrypted_password => user.encrypted_password,
         :company_name => user.company_name,
         :tenant_id => tenant.id,
         :stripe_token => @stripe_token
      )
      tenant_admin.add_role("admin")
      tenant_admin.save(:validate=> false)
    end
  end
  
  def update_plan(role)
    self.role_ids = []
    self.add_role(role.name)
    unless customer_id.nil? || !@current_tenant.nil?
      customer = Stripe::Customer.retrieve(customer_id)
      customer.update_subscription(:plan => role.name)
    end
    true
  rescue Stripe::StripeError => e
    logger.error "Stripe Error: " + e.message
    errors.add :base, "Unable to update your subscription. #{e.message}."
    false
  end
  
  def update_stripe
    return if email.include?(ENV['ADMIN_EMAIL'])
    return if PgTools.search_path != PgTools.default_search_path
    return if email.include?('@example.com') and not Rails.env.production?
    if customer_id.nil?
      if !stripe_token.present?
        raise "Stripe token not present. Can't create account."
      end
      if coupon.blank?
        customer = Stripe::Customer.create(
          :email => email,
          :description => [first_name, last_name].join(' '),
          :card => stripe_token,
          :plan => roles.first.name
        )
      else
        customer = Stripe::Customer.create(
          :email => email,
          :description => [first_name, last_name].join(' '),
          :card => stripe_token,
          :plan => roles.first.name,
          :coupon => coupon
        )
      end
    else
      customer = Stripe::Customer.retrieve(customer_id)
      if stripe_token.present?
        customer.card = stripe_token
      end
      customer.email = email
      customer.description = [first_name, last_name].join(' ')
      customer.save
    end
    self.last_4_digits = customer.active_card.last4
    self.customer_id = customer.id
    self.stripe_token = nil
  rescue Stripe::StripeError => e
    logger.error "Stripe Error: " + e.message
    errors.add :base, "#{e.message}."
    self.stripe_token = nil
    false
  end
  
  def cancel_subscription
    unless customer_id.nil? || !@current_tenant.nil?
      customer = Stripe::Customer.retrieve(customer_id)
      unless customer.nil? or customer.respond_to?('deleted')
        if customer.subscription.status == 'active'
          customer.cancel_subscription
        end
      end
    end
  rescue Stripe::StripeError => e
    logger.error "Stripe Error: " + e.message
    errors.add :base, "Unable to cancel your subscription. #{e.message}."
    false
  end
  
  def expire
    UserMailer.expire_email(self).deliver
    destroy
  end
  
  def photo_url
    timecards.first ? timecards.first.photo_in_url : ""
  end
end
