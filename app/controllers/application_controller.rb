require 'PgTools'

class ApplicationController < ActionController::Base
  protect_from_forgery

  prepend_before_filter :scope_current_tenant #used for devise sessions
  #around_filter :scope_current_tenant #general tenancy scope
  helper_method :current_tenant
  # This is our new function that comes before Devise's one
  before_filter :authenticate_user_from_token!
  #before_filter :redirect_on_subdomain

  private
  
  def authenticate_user_from_token!
    if !params[:auth_token].nil?
      id = params[:id].presence
      user       = id && User.find_by_id(id)
   
      # Notice how we use Devise.secure_compare to compare the token
      # in the database with the token given in the params, mitigating
      # timing attacks.
      if user && Devise.secure_compare(user.authentication_token, params[:auth_token])
        sign_in user
      end
    end
  end

  def redirect_on_subdomain
    if request.subdomain.present? && (request.fullpath == root_path) && current_user.nil?
      redirect_to new_user_session_path
    end
  end
  
  def current_tenant
    subdomain = request.subdomain
    if subdomain.nil? || subdomain.empty?
      company_name = params[:user].nil? ? nil : params[:user][:company_name]
      unless company_name.nil?
        subdomain = company_name
      end
    end
    @current_tenant ||= Tenant.find_by_subdomain(subdomain)
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
        return current_tenant.company_name
      end

      unless current_tenant.nil?
        return current_tenant.subdomain
      end

      return nil;
  end   
  
  def redirect_tenant
    #tenant = Tenant.find_by_subdomain(current_user.company_name)
    #tenant.scope_schema do
    #  user = User.where("company_name = ? AND tenant_id = ?", current_user.company_name, tenant.id).first
    #  user.ensure_authentication_token
    #  user.save!
    #  root_url(:subdomain => user.company_name, :auth_token => user.authentication_token, :id => user.id)
      root_url(:subdomain => current_subdomain)
    #end
  end
  
  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_path, :alert => exception.message
  end

  def after_sign_in_path_for(resource)
    #case
      if current_user.roles.first.name == 'admin' && !current_tenant.nil?
        redirect_tenant
      elsif current_user.roles.first.name == 'admin' && current_tenant.nil?
        users_path
      else current_user.roles.first.name == 'employee'
        authenticated_root_path
      end
    #end
  end

  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path
  end
end