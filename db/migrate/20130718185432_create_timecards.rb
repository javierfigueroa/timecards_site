class CreateTimecards < ActiveRecord::Migration
  def change
    create_table :timecards do |t|
      t.belongs_to :user
      t.float :latitude_in
      t.float :longitude_in
      t.datetime :timestamp_in
      t.has_attached_file :photo_in
      t.float :latitude_out
      t.float :longitude_out
      t.datetime :timestamp_out
      t.has_attached_file :photo_out

      t.timestamps
    end
  end
end
