# frozen_string_literal: true
require 'rails_helper'

describe UpdateAvailability, type: :service do
  subject(:service) { UpdateAvailability.new(occurrence, availability) }
  let(:group) { create(:group) }
  let(:member) { create(:member, group: group) }
  let(:event) { create(:event, :weekly, group: group) }
  let(:occurrence) { event.occurrences.at(event.starts_at) }
  let(:availability) { { member.id => true } }

  it 'adds availability' do
    expect { service.call }.to change(Availability, :count).by(1)
  end

  context 'when the occurrence is saved' do
    before { occurrence.save }

    it 'adds availability' do
      expect { service.call }.to change(Availability, :count).by(1)
    end
  end

  context 'when availability has been recorded' do
    before do
      occurrence.availability.for_member(member).update!(available: false)
    end

    it 'does not add availability' do
      expect { service.call }.not_to change(Availability, :count)
    end

    it 'changes availability' do
      expect { service.call }
        .to change { occurrence.availability.for_member(member).available }
        .from(false)
        .to(true)
    end
  end
end
