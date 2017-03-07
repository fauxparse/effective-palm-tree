class OccurrenceSerializer < ActiveModel::Serializer
  attributes :name, :starts_at, :ends_at
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

  delegate :group, :event, to: :object
end
