# frozen_string_literal: true

require 'rails_helper'

describe OccurrenceSerializer, type: :serializer do
  subject(:serializer) { OccurrenceSerializer.new(occurrence) }

  let(:occurrence) { event.occurrences.occurring_at(event.schedule.first) }
  let(:event) { create(:event, :with_roles) }
  let(:member) { create(:member, group: event.group) }

  before do
    occurrence.availability.build(member: create(:member, group: event.group))
    occurrence.assignments.build(
      allocation: event.allocations.first,
      member: member
    )
  end

  describe 'as JSON' do
    subject(:json) { serializer.as_json }

    it { is_expected.to include :name, :starts_at, :ends_at }
    it { is_expected.not_to include :url }

    context 'with a view context' do
      let(:urls) { double }
      let(:url) { '/event/path/here' }

      before do
        allow(serializer)
          .to receive(:scope)
          .and_return(urls)
        allow(urls)
          .to receive(:event_occurrence_path)
          .with(event.group, event, occurrence)
          .and_return(url)
      end

      it { is_expected.to include url: url }
    end
  end
end
