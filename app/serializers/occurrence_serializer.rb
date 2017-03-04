class OccurrenceSerializer < ActiveModel::Serializer
  attributes :name, :starts_at, :ends_at, :url

  def name
    event.name
  end

  def url
    view_context.event_occurrence_path(group, event, object)
  end

  delegate :group, :event, to: :object
end
