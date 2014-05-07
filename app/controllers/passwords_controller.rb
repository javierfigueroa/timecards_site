class PasswordsController < Devise::PasswordsController
  skip_before_filter :require_no_authentication, :only => [ :create ]
  def new
     super
  end

  # POST /resource/password
  def create
    if @current_tenant.nil?
      subdomain =  request.subdomain.present? ? request.subdomain : resource_params[:company_name]
      tenant = Tenant.find_by(subdomain: subdomain)
      if !tenant.nil?
        tenant.scope_schema do
          super
        end
      else
        super
      end
    else
      super
    end
  end
end