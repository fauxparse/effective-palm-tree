# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Event, type: :model do
  subject(:event) { create(:event, group: group) }
  let(:group) { create(:group) }

  it { is_expected.to be_valid }

  describe '#to_param' do
    subject(:slug) { event.to_param }

    it { is_expected.to eq 'playshop-live' }

    context 'when an event exists with the same name' do
      before { create(:event, group: another_group) }
      let(:another_group) { group }

      it { is_expected.to match(/\Aplayshop-live-\d+\z/) }

      context 'in another group' do
        let(:another_group) { create(:group, name: 'The Others') }

        it { is_expected.to eq 'playshop-live' }
      end
    end
  end

  describe '#schedule' do
    subject(:schedule) { event.schedule }

    it { is_expected.not_to be_nil }
    it { is_expected.to be_an_instance_of(IceCube::Schedule) }

    context 'for a weekly event' do
      let(:event) { create(:event, :weekly) }

      it 'is weekly' do
        expect(schedule.rrules.first).to be_an_instance_of(IceCube::WeeklyRule)
      end

      context 'after reloading' do
        before { event.reload }

        it 'is weekly' do
          expect(schedule.rrules.first)
            .to be_an_instance_of(IceCube::WeeklyRule)
        end
      end
    end
  end

  describe '#starts_at' do
    subject(:starts_at) { event.reload.starts_at }

    it { is_expected.to eq event.schedule.first }
  end

  describe '#ends_at' do
    subject(:ends_at) { event.reload.ends_at }

    it { is_expected.to eq event.schedule.first + 1.hour }

    context 'for a repeating event' do
      let(:event) { create(:event, :weekly) }

      it { is_expected.to be_nil }
    end
  end

  describe '#occurrences' do
    subject(:occurrences) { event.occurrences }
    let(:event) { create(:event, :weekly) }
    let(:start_date) { event.schedule.first.to_date }

    describe '#on' do
      subject(:occurrence) { occurrences.occurring_on(date) }

      context 'the start date' do
        let(:date) { start_date }
        it { is_expected.to be_an_instance_of Occurrence }

        context 'when the occurrence already exists' do
          before do
            event.schedule.first.tap do |times|
              event.occurrences.create!(
                starts_at: times.start_time,
                ends_at: times.end_time
              )
            end
          end

          it { is_expected.to be_an_instance_of Occurrence }

          context 'and the occurrences are loaded' do
            before { event.occurrences.load }
            it { is_expected.to be_an_instance_of Occurrence }
          end
        end
      end

      context 'a week after the start date' do
        let(:date) { start_date + 1.week }
        it { is_expected.to be_an_instance_of Occurrence }
      end

      context 'the day before the start date' do
        let(:date) { start_date - 1.day }
        it { is_expected.to be_nil }
      end
    end
  end

  describe '::between' do
    subject(:range) { Event.between(range_start, range_end) }
    let(:range_start) do
      build(:event).tap(&:valid?).starts_at.beginning_of_month
    end
    let(:range_end) { range_start + 1.month }

    it { is_expected.to include create(:event) }
    it { is_expected.to include create(:event, :weekly) }
    it { is_expected.not_to include create(:event, :old) }
    it { is_expected.to include create(:event, :old, :weekly) }
  end
end
