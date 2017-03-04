class Member < ApplicationRecord
  SLUGGABLE_SCOPE = :group_id
  include Sluggable

  belongs_to :group, counter_cache: true

  validates :name, presence: true
end
