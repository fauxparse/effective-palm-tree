# frozen_string_literal: true
class OccurrenceSerializer < ActiveModel::Serializer
  attributes :name, :group_id, :starts_at, :ends_at, :availability
  attributes :allocations
  attribute :url, if: :url?

  def name
    event.name
  end

  def group_id
    group.to_param
  end

  def url
    scope.event_occurrence_path(group, event, object)
  end

  def url?
    scope.respond_to?(:event_occurrence_path)
  end

  def availability
    object.availability.inject({}) do |result, availability|
      result.update(availability.member_id => availability.available?)
    end
  end

  def allocations
    event.allocations.sort_by(&:position).map do |allocation|
      AllocationSerializer.new(allocation).as_json.merge(
        assignments: assignments(allocation)
      )
    end
  end

  def assignments(allocation)
    ActiveModelSerializers::SerializableResource.new(
      object.assignments.select { |a| a.allocation_id == allocation.id }
    ).as_json
  end

  delegate :group, :event, to: :object
end
