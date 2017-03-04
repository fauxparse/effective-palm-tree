class Group < ApplicationRecord
  include Sluggable

  has_many :events
end
