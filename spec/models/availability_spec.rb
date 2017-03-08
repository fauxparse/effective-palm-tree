require 'rails_helper'

RSpec.describe Availability, type: :model do
  subject(:availability) do
    build(:availability, member: member, occurrence: occurrence)
  end
  let(:occurrence) { create(:occurrence) }
  let(:member) { create(:member, group: occurrence.event.group) }

  it { is_expected.to be_valid }
  it { is_expected.to be_available }

  context 'when it already exists' do
    before { create(:availability, member: member, occurrence: occurrence) }

    it { is_expected.not_to be_valid }
  end
end
