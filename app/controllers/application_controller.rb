require 'PgTools'

class ApplicationController < ActionController::Base
  protect_from_forgery

  prepend_before_filter :scope_current_tenant #used for devise sessions
  around_filter :scope_current_tenant #general tenancy scope
  
  private
  
  def current_tenant
    puts request.subdomain
    @current_tenant ||= Tenant.find_by_subdomain(request.subdomain)
  end
  helper_method :current_tenant
  
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
  
  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_path, :alert => exception.message
  end

  def after_sign_in_path_for(resource)
    case current_user.roles.first.name
      when 'admin'
        users_path
      when 'silver'
        content_silver_path
      # when 'gold'
        # content_gold_path
      # when 'platinum'
        # content_platinum_path
      else
        root_path
    end
  end
end