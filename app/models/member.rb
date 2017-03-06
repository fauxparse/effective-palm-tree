class Member < ApplicationRecord
  include Sluggable

  belongs_to :group, counter_cache: true

  scope :admin, -> { where(admin: true) }
end
