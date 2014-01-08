class AddProjectToTimecards < ActiveRecord::Migration
  def change
    add_reference :timecards, :project, index: true, null: true
  end
end
