# frozen_string_literal: true
require 'rails_helper'

describe EventOccurrences do
  subject(:occurrences) { query_object.all }
  let(:query_object) { EventOccurrences.new(**options) }
  let(:options) { {} }

  it { is_expected.to be_empty }

  context 'with a one-off event' do
    let(:event) { create(:event) }
    let(:options) { { start: event.starts_at.beginning_of_month } }

    it { is_expected.to have_exactly(1).item }

    context 'that has been edited and saved' do
      before { event.occurrences.occurring_at(event.starts_at).save }

      it { is_expected.to have_exactly(1).item }
    end
  end

  context 'with a repeating event' do
    let(:event) { create(:event, :weekly) }
    let(:options) { { start: event.starts_at.beginning_of_month } }

    it { is_expected.to have_exactly(4).items }
  end

  context 'with multiple events' do
    before do
      3.times { create(:event) }
    end

    let(:options) { { start: Event.first.starts_at.beginning_of_month } }

    it { is_expected.to have_exactly(3).items }

    context 'scoped to a single group' do
      let(:options) do
        {
          start: Event.first.starts_at.beginning_of_month,
          scope: Group.first.events
        }
      end

      it { is_expected.to have_exactly(1).item }
    end
  end
end
