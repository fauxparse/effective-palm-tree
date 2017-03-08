class OccurrenceSerializer < ActiveModel::Serializer
  attributes :name, :starts_at, :ends_at, :availability
  attribute :url, if: :url?

  def name
    event.name
  end

  def url
    scope.event_occurrence_path(group, event, object)
  end

  def url?
    scope.respond_to?(:event_occurrence_path)
  end

  def availability
    object.availabilities.inject({}) do |result, availability|
      result[availability.member_id] = availability.available?
    end
  end

  delegate :group, :event, to: :object
end
