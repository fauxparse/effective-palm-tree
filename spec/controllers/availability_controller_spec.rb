# frozen_string_literal: true

require 'rails_helper'

RSpec.describe AvailabilityController, type: :request do
  subject { response }

  let(:group) { create(:group) }
  let(:member) { create(:member, :verified, group: group) }
  let(:user_id) { member.user.try(:to_param) }
  let(:event) { create(:event, :weekly, group: group) }
  let(:date) { event.starts_at.to_date }
  let(:url) do
    event_occurrence_availability_path(
      group.to_param,
      event.to_param,
      date.to_param,
      as: user_id
    )
  end
  let(:occurrence) { event.occurrences.occurring_at(event.starts_at) }

  describe 'GET #show' do
    before do
      get url, params: { format: :json }
    end

    it { is_expected.to be_success }
  end

  describe 'PATCH #update' do
    def patch!
      patch url, params: { availability: availability }, as: :json
    end

    def available
      occurrence
        .availability
        .find_by(member_id: member.id)
        .try!(:available)
    end

    context 'when availability was not recorded before' do
      let(:availability) { { member.id => true } }

      it 'is successful' do
        patch!
        expect(response).to be_success
      end

      it 'creates a new record' do
        expect { patch! }.to change(Availability, :count).by 1
      end

      describe 'availability' do
        before { patch! }
        subject { available }

        it { is_expected.to be true }
      end
    end

    context 'when availability was previously recorded' do
      let(:availability) { { member.id => false } }

      before do
        occurrence.availability.build(member: member).save
      end

      it 'is successful' do
        patch!
        expect(response).to be_success
      end

      it 'creates a new record' do
        expect { patch! }.not_to change(Availability, :count)
      end

      it 'changes the availability' do
        expect { patch! }.to change { available }.from(true).to(false)
      end
    end
  end
end
