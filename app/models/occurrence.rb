class Occurrence < ApplicationRecord
  include TimeRanges

  belongs_to :event
  has_one :group, through: :event
  has_many :availabilities, dependent: :destroy

  def to_param
    starts_at.strftime('%Y-%m-%d')
  end
end
