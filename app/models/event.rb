class Event < ApplicationRecord
  include Sluggable
  include TimeRanges

  has_many :occurrences, dependent: :destroy

  serialize :schedule_options, JSON
  composed_of :schedule,
    class_name: 'IceCube::Schedule',
    mapping: %w(schedule_options to_hash),
    constructor: :from_hash

  before_validation :cache_time_boundaries, if: :schedule?

  validates :name, :starts_at, presence: true

  delegate :duration, to: :schedule

  def schedule?
    schedule.present?
  end

  private

  def cache_time_boundaries
    self.starts_at = schedule.first
    self.ends_at = schedule.last.end_time if schedule.terminating?
  end
end
