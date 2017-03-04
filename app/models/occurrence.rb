class Occurrence < ApplicationRecord
  include TimeRanges

  belongs_to :event
  has_one :group, through: :event

  def to_param
    starts_at.strftime('%Y-%m-%d')
  end
end
