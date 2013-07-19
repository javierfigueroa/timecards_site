class Timecard < ActiveRecord::Base
  belongs_to :user
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
                  
  validates_attachment :photo_in, :content_type => { :content_type => "image/jpg" }      
  validates_attachment :photo_out, :content_type => { :content_type => "image/jpg" }
    
  validates :timestamp_out, :date => {:after => :timestamp_in, :message => 'check out time must be after check in time'}
  validates :timestamp_in, :date => {:before => :timestamp_out, :message => 'check in time must be after check out time'} 
  validates :latitude_in, :presence => true
  validates :longitude_in, :presence => true
  validates :timestamp_in, :presence => true

  has_attached_file :photo_in,
    :storage => :s3,
    :default_url => "http://placehold.it/300x300.jpg&text=No%20Image",
    :s3_credentials => Rails.root.join('config', 's3_photos.yml').to_s,  
    :path => '/:tenant_id/:user_id/photo_in.jpg'
  
  has_attached_file :photo_out,
    :storage => :s3,
    :default_url => "http://placehold.it/300x300.jpg&text=No%20Image",
    :s3_credentials => Rails.root.join('config', 's3_photos.yml').to_s,  
    :path => '/:tenant_id/:user_id/photo_out.jpg'
    
  def damper_image_url_open
      damper_image.url(:medium)
  end
  
  def damper_image_url_closed
      damper_image_second.url(:medium)
  end
  
  Paperclip.interpolates :user_id do |attachment, style|
    "user_#{attachment.instance.user_id}"
  end
  
  Paperclip.interpolates :tenant_id do |attachment, style|
    user = User.find_by_id(attachment.instance.user_id)
    "tenant_#{user.tenant_id}"
  end
    
end
