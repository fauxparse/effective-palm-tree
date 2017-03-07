require 'rails_helper'

RSpec.describe EventsController, type: :request do
  subject { response }
  let(:group) { create(:group) }
  let(:member) { create(:member, :verified, group: group) }
  let(:user_id) { member.user.try(:to_param) }
  let(:events) { [] }

  around do |example|
    Timecop.freeze(Time.zone.local(2017, 3, 1, 12, 34)) { example.run }
  end

  describe 'GET #index' do
    context 'as HTML' do
      before { get events_path }
      it { is_expected.to have_http_status :success }
    end

    context 'as JSON' do
      before do
        events
        get events_path, params: { format: :json, as: user_id }
      end

      it { is_expected.to have_http_status :success }

      describe 'response' do
        subject { json }

        it { is_expected.to be_empty }
      end

      context 'with a repeating event' do
        let(:events) { [create(:event, :weekly, group: group)] }

        describe 'response' do
          subject { json }

          it { is_expected.to have_exactly(4).items }

          it 'lists all the occurrences in the period' do
            expected_times = events.first.schedule
              .next_occurrences(4)
              .map { |t| a_hash_including(startsAt: t.as_json) }

            expect(json).to match expected_times
          end
        end

        context 'in another group' do
          let(:events) { [create(:event, :weekly)] }

          describe 'response' do
            subject { json }

            it { is_expected.to be_empty }
          end
        end
      end
    end
  end
end
