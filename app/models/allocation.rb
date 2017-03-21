# frozen_string_literal: true
class Allocation < ApplicationRecord
  belongs_to :event
  belongs_to :role

  acts_as_list top: 0

  validates :event_id, :role_id, presence: true
  validates :min,
    numericality: {
      greater_than_or_equal_to: 0,
      only_integer: true
    }
  validates :max,
    numericality: {
      greater_than_or_equal_to: 0,
      only_integer: true,
      allow_blank: true
    }
  validate :same_group
  validate :max_not_less_than_min, if: :max?

  private

  def same_group
    errors.add(:role_id, 'must be from the same group as the event') \
      unless event.group_id == role.group_id
  end

  def max_not_less_than_min
    errors.add(:max, 'must be less than the minimum') if max < min
  end
end
