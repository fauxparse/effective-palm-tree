class Event < ApplicationRecord
  include Sluggable
  include TimeRanges

  serialize :recurrence_options, JSON
  composed_of :recurrence,
    class_name: 'Montrose::Recurrence',
    mapping: %w(recurrence_options to_h)

  before_validation :cache_time_boundaries, if: :recurrence?

  validates :name, :starts_at, presence: true

  def recurrence?
    recurrence.present?
  end

  def finite?
    recurrence.finite?
  end

  private

  def cache_time_boundaries
    self.starts_at = recurrence.events.first
    self.ends_at = recurrence.events.to_a.last + duration.seconds if finite?
  end
end
