require 'rails_helper'

RSpec.describe OccurrencesController, type: :request do
  subject { response }
  let(:group) { create(:group) }
  let(:member) { create(:member, :verified, group: group) }
  let(:user_id) { member.user.try(:to_param) }
  let(:event) { create(:event, :weekly, group: group) }
  let(:params) { [ group.to_param, event.to_param, date.to_param ] }

  describe 'GET #show' do
    context 'as JSON' do
      before do
        get event_occurrence_path(*params),
          params: { format: :json, as: user_id }
      end

      context 'for a day in the schedule' do
        let(:date) { event.schedule.first.to_date }
        it { is_expected.to have_http_status :success }

        describe 'response' do
          subject { json }

          it { is_expected.to include startsAt: event.schedule.first.as_json }
        end

        context 'for an event in another group' do
          let(:user_id) { create(:user).to_param }
          it { is_expected.to have_http_status :not_found }
        end
      end

      context 'for a day outside the schedule' do
        let(:date) { event.schedule.first.to_date + 1.day }
        it { is_expected.to have_http_status :not_found }
      end
    end
  end
end
