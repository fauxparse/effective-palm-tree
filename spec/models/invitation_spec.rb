require 'rails_helper'

RSpec.describe Invitation, type: :model do
  subject(:invitation) { build(:invitation, member: member, admin: admin) }

  let(:member) { create(:member) }
  let(:admin) { create(:administrator, group: member.group) }

  it { is_expected.to be_valid }
  it { is_expected.to be_pending }
  it { is_expected.to validate_presence_of(:email) }

  context 'when the inviting member is not an admin' do
    let(:admin) { create(:member, group: member.group) }

    it { is_expected.not_to be_valid }
  end

  context 'when member and admin are from different groups' do
    let(:admin) { create(:administrator) }

    it { is_expected.not_to be_valid }
  end

  context 'when another invitation exists' do
    before { create(:invitation, member: member, admin: admin) }

    it { is_expected.not_to be_valid }

    context 'but is declined' do
      before { member.invitations.last.declined! }

      it { is_expected.to be_valid }
    end
  end
end
