class Availability < ApplicationRecord
  belongs_to :member
  belongs_to :occurrence

  validates :member_id, :occurrence_id, presence: true
  validates :member_id, uniqueness: { scope: :occurrence_id, allow_blank: true }
end
