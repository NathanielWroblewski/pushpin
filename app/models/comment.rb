class Comment < ActiveRecord::Base
  validates :text, presence: true
  validates :author, presence: true
  validates :county_id, presence: true
end
