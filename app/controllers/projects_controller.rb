class ProjectsController < ApplicationController
  before_action :set_project, only: [:show, :edit, :update, :destroy]

  # GET /projects
  def index
    @projects = Project.all
    respond_to do |format|
      format.html 
      format.json { 
        render json: @projects.to_json(:include => :timecards) 
      }
    end
  end

  # GET /projects/1
  def show
    respond_to do |format|
      format.html 
      format.json { 
        render json: @project.to_json(:include => :timecards) 
      }
    end
  end

  # GET /projects/new
  def new
    @project = Project.new
  end

  # GET /projects/1/edit
  def edit
  end
  
  # GET /users/in_date/out_date.json
  # get user between a date range
  def date
    in_date = DateTime.strptime(params[:in_date], "%m-%d-%Y").beginning_of_day.utc
    out_date = DateTime.strptime(params[:out_date], "%m-%d-%Y").end_of_day.utc
    
    @projects = Project.on_dates(in_date, out_date).accessible_by(current_ability, :read)

   respond_to do |format|
      format.html { redirect_to root_path }
      format.json { 
        render json: @projects.to_json(
          :include => [:timecards]
          ) 
      }
    end
  end

  # POST /projects
  def create
    @project = Project.new(project_params)

    if @project.save
      redirect_to @project, notice: 'Project was successfully created.'
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /projects/1
  def update
    if @project.update(project_params)
      redirect_to @project, notice: 'Project was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /projects/1
  def destroy
    @project.destroy
    redirect_to projects_url, notice: 'Project was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project
      @project = Project.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def project_params
      params.require(:project).permit(:name)
    end
end
