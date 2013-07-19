class RegistrationsController < Devise::RegistrationsController
  skip_before_filter :require_no_authentication, :only => [ :new, :create ]
  def new
    @plan = params[:plan]
    if !@current_tenant.nil? || @plan && ENV["ROLES"].include?(@plan) && @plan != "admin"
      super
    else
      redirect_to root_path, :notice => 'Please select a subscription plan below.'
    end
  end
  
  
  # POST /resource
  def create    
    if @current_tenant.nil?
      super
    else      
      build_resource
      
      resource.company_name = current_user.company_name
      resource.tenant_id = @current_tenant.id
      resource.add_role("silver")
      
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
