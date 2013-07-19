class Timecard < ActiveRecord::Base
  attr_accessible :latitude_in, 
                  :longitude_in, 
                  :timestamp_in,
                  :photo_in, 
                  :photo_in_content_type, 
                  :photo_in_file_size,
                  :latitude_out, 
                  :longitude_out, 
                  :timestamp_out,
                  :photo_out, 
                  :photo_out_content_type, 
                  :photo_out_file_size
                  
  has_attached_file :photo_in,
    :storage => :s3,
    :default_url => "http://placehold.it/300x300.jpg&text=No%20Image",
    :s3_credentials => Rails.root.join('config', 's3_photos.yml').to_s,  
    :path => '/:id/open'
  
  has_attached_file :photo_out,
    :storage => :s3,
    :default_url => "http://placehold.it/300x300.jpg&text=No%20Image",
    :s3_credentials => Rails.root.join('config', 's3_photos.yml').to_s,  
    :path => '/:id/closed'
    
    def damper_image_url_open
        damper_image.url(:medium)
    end
    
    def damper_image_url_closed
        damper_image_second.url(:medium)
    end
end
