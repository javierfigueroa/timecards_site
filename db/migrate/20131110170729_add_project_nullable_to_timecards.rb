class AddProjectNullableToTimecards < ActiveRecord::Migration
  def change
    change_column :timecards, :project_id, :integer, :null => true
  end
end
