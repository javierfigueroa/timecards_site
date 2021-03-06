class UsersController < ApplicationController
  before_filter :authenticate_user!

  def index
    authorize! :index, @user, :message => 'Not authorized as an administrator.'
    @users = User.all
  end

  def show
    @user = User.find(params[:id])
  end

  # GET /users/in_date/out_date.json
  # get user between a date range
  def date
    in_date = DateTime.strptime(params[:in_date], "%m-%d-%Y").beginning_of_day.utc
    out_date = DateTime.strptime(params[:out_date], "%m-%d-%Y").end_of_day.utc
    
    @users = User.on_dates(in_date, out_date).accessible_by(current_ability, :read)

   respond_to do |format|
      format.html { redirect_to root_path }
      format.json { 
        render json: @users.to_json(
          :methods => [:photo_url],
          :include => [:timecards]
          ) 
      }
    end
  end

  # GET /users/1/edit
  # GET /users/1/edit.xml
  # GET /users/1/edit.json                                HTML AND AJAX
  #-------------------------------------------------------------------
  def edit
    @user = User.find(params[:id])
    @user.wage = @user.wage == 0 ? nil : @user.wage
    @menu_items = []
    @menu_items[0] = { :url => "#", :name => "Edit User"}
    respond_to do |format|
      format.json { render :json => @user }
      format.xml  { render :xml => @user }
      format.html
    end
  end
  
  def update
    authorize! :update, @user, :message => 'Not authorized as an administrator.'
    @user = User.find(params[:id])
    role = Role.find(params[:user][:role_ids]) unless params[:user][:role_ids].nil?
    @menu_items = []
    @menu_items[0] = { :url => "#", :name => "Edit User"}

    if params[:user][:password].blank?
      params[:user].delete("password")
      params[:user].delete("password_confirmation")
    end

    params[:user] = params[:user].except(:role_ids)
    if @user.update_attributes(params[:user])
      @user.update_plan(role) unless role.nil?
      redirect_to users_path, :notice => "User updated."
    else
      redirect_to users_path, :alert => "Unable to update user."
    end
  end
    
  def destroy
    authorize! :destroy, @user, :message => 'Not authorized as an administrator.'
    user = User.find(params[:id])
    unless user == current_user

      if current_user.email.include?(ENV['ADMIN_EMAIL'])
        user.cancel_subscription
      end

      user.really_destroy!

      redirect_to users_path, :notice => "User deleted."
    else
      redirect_to users_path, :notice => "Can't delete yourself."
    end
  end
end