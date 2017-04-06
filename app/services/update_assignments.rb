# frozen_string_literal: true

class UpdateAssignments
  attr_reader :occurrence, :changes

  def initialize(occurrence, changes)
    @occurrence = occurrence
    @changes = changes
  end

  def call
    changes.each do |member_id, old_allocation_id, new_allocation_id|
      assignment = find_or_build_assignment(member_id, old_allocation_id)
      update_assignment(assignment, new_allocation_id)
    end
    occurrence.save!
  end

  private

  def assignments
    occurrence.assignments
  end

  def find_or_build_assignment(member_id, allocation_id)
    if allocation_id.try!(:positive?)
      assignments.detect do |a|
        a.member_id == member_id && a.allocation_id == allocation_id
      end
    else
      assignments.build(member_id: member_id)
    end
  end

  def update_assignment(assignment, new_allocation_id)
    if new_allocation_id.try!(:positive?)
      assignment.allocation_id = new_allocation_id
    else
      assignment.mark_for_destruction
    end
  end
end
