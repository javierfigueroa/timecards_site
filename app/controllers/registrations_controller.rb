class RegistrationsController < Devise::RegistrationsController
  before_filter :update_sanitized_params, if: :devise_controller?
  skip_before_filter :require_no_authentication, :only => [ :new, :create ]
  
  def update_sanitized_params
    devise_parameter_sanitizer.for(:sign_up) {|u| u.permit( :first_name, :last_name, :email, :password, :password_confirmation, :remember_me, :stripe_token, :company_name, :encrypted_password, :tenant_id)}
  end
    
  def new
    @plan = params[:plan]
    
    #for when we are on the main website
    if @current_tenant.nil? && @plan && ENV["ROLES"].include?(@plan) && @plan != "admin"
      super
    #for when an admin is creating users within their tenant
    elsif !@current_tenant.nil? && (current_user.has_role? :admin)
      super
    #for when an employee tries to create users
    elsif  !@current_tenant.nil? && !(current_user.has_role? :admin)
      redirect_to root_path, :notice => 'Not enough permissions to create accounts.'
    else
      redirect_to root_path, :notice => 'Please select a subscription plan below.'
    end
  end

  def billing
    @user = current_user
    render :billing
  end
  
  # POST /resource
  def create    
    #we are in the main website, let devise handle it
    if @current_tenant.nil?
      super
    #we have a defined tenant, create a user within the tenant
    else      
      build_resource(sign_up_params)  
      
      resource.company_name = current_user.company_name
      resource.tenant_id = @current_tenant.id
      resource.add_role("employee")
      
      if resource.save
        expire_session_data_after_sign_in!
        set_flash_message :notice, :signed_up if is_navigational_format?
        respond_with resource, :location => after_sign_up_path_for(resource)
      else
        clean_up_passwords resource
        respond_with resource
      end
    end
  end

  def destroy
    super
  end

  def update_plan
    @user = current_user
    role = Role.find(params[:user][:role_ids]) unless params[:user][:role_ids].nil?
    if @user.update_plan(role)
      redirect_to edit_user_registration_path, :notice => 'Updated plan.'
    else
      flash.alert = 'Unable to update plan.'
      render :edit
    end
  end

  def update_card
    @user = current_user
    @user.stripe_token = params[:user][:stripe_token]
    if @user.save
      redirect_to edit_user_registration_path, :notice => 'Updated card.'
    else
      flash.alert = 'Unable to update card.'
      render :edit
    end
  end

  private
  def build_resource(*args)
    super
    if params[:plan]
      resource.add_role(params[:plan])
    end
  end
end
