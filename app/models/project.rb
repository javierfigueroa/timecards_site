class Project < ActiveRecord::Base
  has_many :timecards
  scope :on_dates, lambda { |in_date, out_date| 
    includes(:timecards).
      where('timecards.timestamp_in >= ? AND (timecards.timestamp_out IS NULL OR timecards.timestamp_out <= ?)', in_date, out_date).
      references(:timecards)
  }
  
  attr_accessible :name
end
