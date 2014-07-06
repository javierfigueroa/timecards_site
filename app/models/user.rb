require 'PgTools'

class User < ActiveRecord::Base
  acts_as_paranoid
  rolify
  has_many :timecards
  scope :on_dates, lambda { |in_date, out_date| 
    includes(:timecards).
      where('timecards.timestamp_in >= ? AND timecards.timestamp_in <= ? AND (timecards.timestamp_out IS NULL OR timecards.timestamp_out <= ?)', in_date, out_date, out_date).
      references(:timecards)
  }
  
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :first_name, :last_name, :email, :password,
                  :password_confirmation, :remember_me, :stripe_token,
                  :company_name, :encrypted_password, :tenant_id, :wage
  attr_accessor :stripe_token, :coupon
  before_create :update_stripe
  #before_destroy :cancel_subscription
  before_destroy :destroy_tenant
  before_save :strip_whitespace

  # You likely have this before callback set up for the token.
  before_save :ensure_authentication_token
  validates :wage, :numericality => { :greater_than_or_equal_to => 0 }
  
  def create_tenant
    if tenant_id.nil? && !(has_role? :admin)
      tenant = Tenant.create(subdomain: company_name)
      if tenant.save
        create_admin_in_tenant(tenant)
      else
        errors.add :base, "Web address already exists"
        return false
      end
    end
  end
  
  def destroy_tenant
    if PgTools.search_path == PgTools.default_search_path
      tenant = Tenant.find_or_create_by(subdomain: self.company_name)
      tenant.destroy
    end
  end

  #used to crete first user and admin of the tenant scheme
  def create_admin_in_tenant(tenant)
    user = self
    tenant.scope_schema do
      tenant_admin = User.create(
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
    unless customer_id.nil? 
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
    return if !(has_role? :admin)
    return if email.include?('@example.com') #and not Rails.env.production?
    if customer_id.nil?
      if !stripe_token.present?
        customer = Stripe::Customer.create(
            :email => email,
            :description => [first_name, last_name].join(' '),
            :plan => "silver"
        )
      else
        customer = Stripe::Customer.create(
          :email => email,
          :description => [first_name, last_name].join(' '),
          :card => stripe_token,
          :plan => "silver"
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

    if !customer.active_card.nil?
      self.last_4_digits = customer.active_card.last4
    end

    self.customer_id = customer.id
    self.stripe_token = nil
  rescue Stripe::StripeError => e
    logger.error "Stripe Error: " + e.message
    errors.add :base, "#{e.message}."
    self.stripe_token = nil
    false
  end
  
  def cancel_subscription
    user = self
    tenant = Tenant.find_by_subdomain(user.company_name)
    tenant.scope_schema do
      tenant_user = User.where("company_name = ? AND tenant_id = ?", user.company_name, tenant.id).first
      unless tenant_user.customer_id.nil?
        customer = Stripe::Customer.retrieve(tenant_user.customer_id)
        unless customer.nil? or customer.respond_to?('deleted')
          #if customer.subscription.status == 'active'
            customer.cancel_subscription
          #end
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

  def activate
    UserMailer.actived_email(self).deliver
    #restore(id, :recursive => true)
  end

  def de_activate
    UserMailer.de_actived_email(self).deliver
  end

  def warn
    UserMailer.trial_ending_soon(self).deliver
  end
  
  def photo_url
    timecards.first ? timecards.first.photo_in_url : ""
  end

  def ensure_authentication_token
    if authentication_token.blank?
      self.authentication_token = generate_authentication_token
    end
  end

  def active_for_authentication?
    if PgTools.search_path != PgTools.default_search_path
      #check if the tenant's account is active or not
      user = self
      PgTools.default_scope_schema do
        tenant = Tenant.find_by_subdomain(user.company_name)
        client = User.where("company_name = ?", user.company_name).first
        super && client
      end
    else
      super && !deleted_at
    end
  end

  private

  def strip_whitespace
    if !self.company_name.nil?
      self.company_name.gsub!(/\s+/, '')
    end
    # etc...
  end

  def generate_authentication_token
    loop do
      token = Devise.friendly_token
      break token unless User.where(authentication_token: token).first
    end
  end
end
