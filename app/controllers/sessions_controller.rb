class SessionsController < Devise::SessionsController
  def create
    resource = warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#new")
    set_flash_message(:notice, :signed_in) if is_navigational_format?
    sign_in(resource_name, resource)

    #current_user.reset_authentication_token!
    #current_user.ensure_authentication_token
    current_user.save!

    respond_to do |format|
      format.html do
        respond_with resource, :location => after_sign_in_path_for(resource_name)
      end
      format.json do
        render :json => {
          :token => current_user.authentication_token, 
          :id => current_user.id,
          :first_name => current_user.first_name,
          :last_name => current_user.last_name,
          :email => current_user.email }, :status => :ok
      end
    end
  end
end 