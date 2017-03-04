class OccurrenceSerializer < ActiveModel::Serializer
  attributes :name, :starts_at, :ends_at, :url

  def name
    event.name
  end

  def url
    view_context.event_occurrence_path(event, object)
  end

  delegate :event, to: :object
end
