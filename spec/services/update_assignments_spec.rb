# frozen_string_literal: true
require 'rails_helper'

describe UpdateAssignments, type: :service do
  subject(:service) { UpdateAssignments.new(occurrence, changes) }
  let(:event) { create(:event, :with_roles) }
  let(:member) { create(:member, group: event.group) }
  let(:date) { event.starts_at.to_date }
  let(:occurrence) { event.occurrences.occurring_on(date).tap(&:save) }

  context 'adding assignments' do
    let(:changes) do
      [[member.id, 0, event.allocations.first.id]]
    end

    it 'adds an assignment' do
      expect { service.call }.to change { occurrence.assignments.count }.by 1
    end
  end

  context 'removing assignments' do
    let(:changes) do
      [[member.id, event.allocations.first.id, 0]]
    end

    before do
      occurrence.assignments.create!(
        member_id: member.id,
        allocation_id: event.allocations.first.id
      )
    end

    it 'removes an assignment' do
      expect { service.call }.to change { occurrence.assignments.count }.by(-1)
    end
  end

  context 'changing assignments' do
    let(:changes) do
      [[member.id, event.allocations.first.id, event.allocations.second.id]]
    end

    before do
      occurrence.assignments.create!(
        member_id: member.id,
        allocation_id: event.allocations.first.id
      )
    end

    it 'removes an assignment' do
      expect { service.call }.not_to change { occurrence.assignments.count }
    end
  end
end
