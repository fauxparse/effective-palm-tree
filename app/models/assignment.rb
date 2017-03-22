class Assignment < ApplicationRecord
  belongs_to :member
  belongs_to :allocation
  belongs_to :occurrence
  has_one :event, through: :occurrence
  has_one :role, through: :allocation

  validates :member_id, :allocation_id, :occurrence_id, presence: true
  validates :member_id, uniqueness: { scope: [:allocation_id, :occurrence_id] }

  scope :confirmed, -> { where(confirmed: true) }

  def confirmed?
    confirmed_at.present?
  end
end
