class Group < ApplicationRecord
  include Sluggable

  has_many :events
  has_many :members
end
