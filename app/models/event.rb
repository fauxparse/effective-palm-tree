# frozen_string_literal: true
class Event < ApplicationRecord
  include Sluggable
  include TimeRanges

  belongs_to :group
  has_many :allocations,
    -> { order(position: :asc) },
    autosave: true,
    dependent: :destroy

  has_many :occurrences, dependent: :destroy do
    def on(date)
      start = date.beginning_of_day
      stop = date.end_of_day
      time = schedule.occurrences_between(start, stop).first
      at(time) if time.present?
    end

    def at(time)
      time = schedule.occurrences_between(time, time + 1.day).first
      existing_occurrence_at(time) if time.present?
    end

    def schedule
      proxy_association.owner.schedule
    end

    def existing_occurrence_at(time)
      existing = if loaded?
                   detect { |o| o.starts_at == time }
                 else
                   where(starts_at: time).first
                 end

      existing || build(starts_at: time.start_time, ends_at: time.end_time)
    end
  end

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

  def self.for_user(user)
    joins(group: [:members]).where('members.user_id = ?', user.id)
  end

  private

  def cache_time_boundaries
    self.starts_at = schedule.first
    self.ends_at = schedule.last.end_time if schedule.terminating?
  end
end
