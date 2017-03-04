class Member < ApplicationRecord
  include Sluggable

  belongs_to :group, counter_cache: true

  validates :name, presence: true
end
