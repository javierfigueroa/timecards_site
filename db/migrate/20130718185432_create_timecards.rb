class CreateTimecards < ActiveRecord::Migration
  def change
    create_table :timecards do |t|
      t.float :latitude_in
      t.float :longitude_in
      t.date :timestamp_in
      t.has_attached_file :photo_in
      t.float :latitude_out
      t.float :longitude_out
      t.date :timestamp_out
      t.has_attached_file :photo_out

      t.timestamps
    end
  end
end
