# frozen_string_literal: true
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
            occurrences = events.first.schedule.next_occurrences(4)
            expected_times = occurrences.map do |t|
              a_hash_including(startsAt: t.as_json)
            end

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

  describe 'PATCH #roles' do
    let(:event) { create(:event, group: group) }
    let(:date) { event.starts_at.to_date }
    let(:role) { create(:role, group: group) }
    let(:roles) do
      [{ role_id: role.id, min: 1, max: 4 }]
    end

    def patch!
      patch event_occurrence_roles_path(group, event, date, as: user_id),
        params: { roles: roles },
        as: :json
    end

    it 'updates the roles' do
      expect { patch! }.to change { event.allocations.count }.by(1)
    end

    describe 'response' do
      before { patch! }

      let(:expected_response) do
        [
          {
            'roleId' => role.id,
            'id' => event.allocations.first.id,
            'min' => 1,
            'max' => 4
          }
        ]
      end

      it 'renders the allocations' do
        expect(json).to match a_hash_including(allocations: expected_response)
      end
    end
  end

  describe 'PATCH #assignments' do
    let(:event) { create(:event, :with_roles, group: group) }
    let(:date) { event.starts_at.to_date }
    let(:occurrence) { event.occurrences.occurring_on(date).tap(&:save) }

    def patch!
      patch event_occurrence_assignments_path(group, event, date, as: user_id),
        params: { assignments: assignments },
        as: :json
    end

    context 'adding assignments' do
      let(:assignments) do
        [[member.id, 0, event.allocations.first.id]]
      end

      it 'adds an assignment' do
        expect { patch! }.to change { occurrence.assignments.count }.by 1
      end
    end

    context 'removing assignments' do
      let(:assignments) do
        [[member.id, event.allocations.first.id, 0]]
      end

      before do
        occurrence.assignments.create!(
          member_id: member.id,
          allocation_id: event.allocations.first.id
        )
      end

      it 'removes an assignment' do
        expect { patch! }.to change { occurrence.assignments.count }.by(-1)
      end
    end

    context 'changing assignments' do
      let(:assignments) do
        [[member.id, event.allocations.first.id, event.allocations.second.id]]
      end

      before do
        occurrence.assignments.create!(
          member_id: member.id,
          allocation_id: event.allocations.first.id
        )
      end

      it 'removes an assignment' do
        expect { patch! }.not_to change { occurrence.assignments.count }
      end
    end
  end
end
