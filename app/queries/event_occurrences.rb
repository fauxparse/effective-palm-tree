class EventOccurrences
  attr_reader :start, :stop

  def initialize(scope: Event, start: nil, stop: nil)
    @start = parse_time(start || Time.zone.now)
    @stop = parse_time(stop || (@start + 1.month))
    @event_scope = scope.between(@start, @stop)
  end

  def all
    occurrences.reject(&:deleted?).sort_by(&:starts_at)
  end

  private

  def parse_time(time)
    Time.zone.parse(time.to_s)
  end

  def events
    @events ||= @event_scope.all
  end

  def occurrences
    @occurrences ||= events.flat_map do |event|
      event.schedule.occurrences_between(start, stop).map do |time|
        new_or_existing_occurrence(event, time.start_time, time.end_time)
      end
    end
  end

  def existing
    @existing ||= Hash.new { [] }.merge(
      Occurrence
        .where(event: events)
        .includes(:event, :availability)
        .between(start, stop)
        .group_by(&:event)
    )
  end

  def new_or_existing_occurrence(event, starts_at, ends_at)
    existing[event].detect { |o| o.starts_at == starts_at } ||
      event.occurrences.build(
        starts_at: starts_at,
        ends_at: ends_at
      )
  end
end
