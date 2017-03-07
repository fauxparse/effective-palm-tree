class OccurrenceSerializer < ActiveModel::Serializer
  attributes :name, :starts_at, :ends_at
  attribute :url, if: :has_url?

  def name
    event.name
  end

  def url
    scope.event_occurrence_path(group, event, object)
  end

  delegate :group, :event, to: :object

  def has_url?
    scope.respond_to?(:event_occurrence_path)
  end
end
