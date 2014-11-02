class Pin < ActiveRecord::Base
  validates :county_id, presence: true
  validates :visitor_count, presence: true
end
