# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Allocation, type: :model do
  subject(:allocation) { build(:allocation, event: event, role: role) }

  let(:event) { create(:event) }
  let(:role) { create(:role, group: event.group) }

  it { is_expected.to be_valid }

  context 'when event and role belong to different groups' do
    let(:role) { create(:role) }

    it { is_expected.not_to be_valid }
  end

  context 'when max < min' do
    subject(:allocation) do
      build(:allocation, event: event, role: role, min: 7, max: 6)
    end

    it { is_expected.not_to be_valid }
  end
end
