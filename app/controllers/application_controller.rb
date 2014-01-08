require 'PgTools'

class ApplicationController < ActionController::Base
  protect_from_forgery

  prepend_before_filter :scope_current_tenant #used for devise sessions
  # around_filter :scope_current_tenant #general tenancy scope
  helper_method :current_tenant
  # This is our new function that comes before Devise's one
  before_filter :authenticate_user_from_token!
 
  private
  
  def authenticate_user_from_token!
    if !params[:auth_token].nil?
      user_email = params[:user][:email].presence
      user       = user_email && User.find_by_email(user_email)
   
      # Notice how we use Devise.secure_compare to compare the token
      # in the database with the token given in the params, mitigating
      # timing attacks.
      if user && Devise.secure_compare(user.authentication_token, params[:auth_token])
        sign_in user, store: false
      end
    end
  end
  
  def current_tenant
    @current_tenant ||= Tenant.find_by_subdomain(request.subdomain)
  end
  
  def scope_current_tenant(&block)
    if !current_tenant.nil?
      current_tenant.scope_schema("public", &block)
    else
      PgTools.restore_default_search_path
      yield if block_given?
    end
  end
  
  def current_subdomain
      if request.subdomains.first.present? && request.subdomains.first != "www"
        current_subdomain = current_tenant.company_name
      else 
        current_subdomain = nil
      end
      return current_subdomain
  end   
  
  def redirect_tenant
      tenant = Tenant.find_by_subdomain(current_user.company_name)
      tenant.scope_schema("public")
      user = User.find_by_email(current_user.email)
      sign_in user, :bypass => true
      root_url(subdomain: current_user.company_name)
  end
  
  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_path, :alert => exception.message
  end

  def after_sign_in_path_for(resource)
    case current_user.roles.first.name
      when 'admin'
        users_path
      when 'silver'
        redirect_tenant
      when 'employee'
        authenticated_root_path
    end
  end
end