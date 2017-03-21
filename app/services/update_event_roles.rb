class UpdateEventRoles
  attr_reader :event, :attributes

  def initialize(event, attributes)
    @event = event
    @attributes = attributes
  end

  def call
    Allocation.acts_as_list_no_update do
      event.with_lock do
        delete_old_allocations
        add_or_update_allocations
        event.save!
      end
    end
  end

  delegate :allocations, to: :event

  private

  def delete_old_allocations
    allocations.each do |allocation|
      allocation.mark_for_destruction unless new_ids.include?(allocation.id)
    end
  end

  def add_or_update_allocations
    attributes.each.with_index do |attrs, i|
      allocation_with_id(attrs[:id]).attributes = \
        attrs.except(:id).merge(position: i)
    end
  end

  def allocation_with_id(id)
    if id && id > 0
      allocations.detect { |a| a.id == id }
    else
      allocations.build
    end
  end

  def new_ids
    @new_ids ||= attributes.map { |a| a[:id] }.compact
  end
end
