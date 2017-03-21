# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Member, type: :model do
  subject(:member) { create(:member, group: group) }
  let(:group) { create(:group) }

  it { is_expected.to be_persisted }
  it { is_expected.to be_valid }
  it { is_expected.not_to be_admin }

  describe '#to_param' do
    subject(:slug) { member.to_param }

    it { is_expected.to eq 'matt' }

    context 'when a user exists' do
      let(:another_group) { group }
      before { create(:member, group: another_group) }

      it { is_expected.not_to eq 'matt' }

      context 'in another group' do
        let(:another_group) { create(:group, name: 'Other') }

        it { is_expected.to eq 'matt' }
      end
    end
  end
end
