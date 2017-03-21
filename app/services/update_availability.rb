# frozen_string_literal: true
class UpdateAvailability
  attr_reader :occurrence

  def initialize(occurrence, availability = {})
    @occurrence = occurrence
    @availability = availability
  end

  def call
    occurrence.with_lock do
      @availability.each do |member_id, value|
        update_availability(
          occurrence.availability.for_member(member_id),
          value
        )
      end
      occurrence.save!
    end
  end

  private

  def update_availability(availability, value)
    if value.nil?
      availability.mark_for_destruction
    else
      availability.available = value
    end
  end
end
