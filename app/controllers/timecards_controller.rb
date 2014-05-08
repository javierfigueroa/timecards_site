class TimecardsController < ApplicationController
  before_filter :authenticate_user!
  respond_to :json
  
  # GET /timecards
  # GET /timecards.json
  def index
    @timecards = Timecard.accessible_by(current_ability, :read)

    respond_to do |format|
      format.html # index.html.erb
      format.json { 
        render json: @timecards.to_json(
          :methods => [:photo_in_url, :photo_out_url],
          :include => { :user => { :only => [:first_name, :last_name, :wage] } }
          ) 
      }
    end
  end

  # GET /timecards/1
  # GET /timecards/1.json
  def show
    @timecard = Timecard.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @timecard.to_json(
          :methods => [:photo_in_url, :photo_out_url],
          :include => { :user => { :only => [:first_name, :last_name, :wage] } }
          ) 
      }
    end
  end
  
  # GET /timecards/today
  # GET /timecards/today.json
  # get timecards for the current day for the current user
  def today
    @timecard = Timecard.on_today(current_user).first

    if @timecard.nil?
      respond_to do |format|
        format.html # show.html.erb
        format.json { render json: {} }
      end
    else
      respond_to do |format|
        format.html # show.html.erb
        format.json { render json: @timecard.to_json(
            :methods => [:photo_in_url, :photo_out_url],
            :include => [:project => { :only =>[:id, :name]}]
            )
        }
      end
    end
  end
  
  
  # GET /timecards/in_date/out_date.json
  # get timecards based on from date and to date
  def date
    in_date = DateTime.strptime(params[:in_date], "%m-%d-%Y").beginning_of_day.utc
    out_date = DateTime.strptime(params[:out_date], "%m-%d-%Y").end_of_day.utc
    
    @timecards = Timecard.on_dates(in_date, out_date).accessible_by(current_ability, :read)

   respond_to do |format|
      format.html { redirect_to root_path }
      format.json { 
        render json: @timecards.to_json(
          :methods => [:photo_in_url, :photo_out_url],
          :include => { :user => { :only => [:first_name, :last_name, :wage] } }
          ) 
      }
    end
  end
  
  # GET /timecards/in_date/out_date/user_id.json or /timecards/in_date/out_date/project_id.json
  # get timecards based on a from date and to date and for a user id
  def date_and_user_id
    in_date = DateTime.strptime(params[:in_date], "%m-%d-%Y").beginning_of_day.utc
    out_date = DateTime.strptime(params[:out_date], "%m-%d-%Y").end_of_day.utc
 
    @timecards = params[:user_id].nil? ?
      Timecard.on_dates_and_project_id(in_date, out_date, params[:project_id]).accessible_by(current_ability, :read) :
      Timecard.on_dates_and_user_id(in_date, out_date, params[:user_id]).accessible_by(current_ability, :read);

   respond_to do |format|
      format.html { redirect_to root_path }
      format.json { 
        render json: @timecards.to_json(
          :methods => [:photo_in_url, :photo_out_url],
          :include => { :user => { :only => [:first_name, :last_name, :wage] }, :project => { :only => [ :name ]} }
          )
      }
    end
  end

  # GET /timecards/new
  # GET /timecards/new.json
  def new
    @timecard = Timecard.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @timecard }
    end
  end

  # GET /timecards/1/edit
  def edit
    @timecard = Timecard.find(params[:id])
  end

  # POST /timecards
  # POST /timecards.json
  def create
    @timecard = Timecard.new(params[:timecard])
    @timecard.user = current_user
    
    respond_to do |format|
      if @timecard.save
        format.html { redirect_to @timecard, notice: 'Timecard was successfully created.' }
        format.json { render json: @timecard.to_json(
          :methods => [:photo_in_url, :photo_out_url],
          :include => { :user => { :only => [:first_name, :last_name, :wage] } }
          ), status: :created, location: @timecard }
      else
        format.html { render action: "new" }
        format.json { render json: @timecard.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /timecards/1
  # PUT /timecards/1.json
  def update
    @timecard = Timecard.find(params[:id])

    respond_to do |format|
      if @timecard.update_attributes(params[:timecard])
        format.html { redirect_to @timecard, notice: 'Timecard was successfully updated.' }
        format.json { render json: @timecard.to_json(
            :methods => [:photo_in_url, :photo_out_url],
            :include => [:project => { :only =>[:id, :name]}]
        )
        }
      else
        format.html { render action: "edit" }
        format.json { render json: @timecard.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /timecards/1
  # DELETE /timecards/1.json
  def destroy
    @timecard = Timecard.find(params[:id])
    @timecard.destroy

    respond_to do |format|
      format.html { redirect_to timecards_url }
      format.json { head :no_content }
    end
  end
end
