require 'rails_helper'

describe AcceptInvitation, type: :service do
  subject(:service) { AcceptInvitation.new(invitation, user) }

  let(:invitation) { create(:invitation) }
  let(:member) { invitation.member }
  let(:user) { create(:user) }
  let(:listener) { double }

  before do
    allow(listener).to receive(:success)
    allow(listener).to receive(:expired)
    allow(listener).to receive(:invalid)
    allow(listener).to receive(:already_a_member)
    service
      .on(:success, &listener.method(:success))
      .on(:expired, &listener.method(:expired))
      .on(:invalid, &listener.method(:invalid))
      .on(:already_a_member, &listener.method(:already_a_member))
  end

  it 'associates the member with the user' do
    expect { service.call }
      .to change { member.reload.user }
      .from(nil)
      .to(user)
  end

  it 'publishes :success' do
    service.call
    expect(listener).to have_received(:success).with(member)
  end

  context 'when the user is already a member' do
    let!(:existing_member) do
      create(:member, user: user, group: invitation.group)
    end

    it 'does not change the existing membership' do
      expect { service.call }.not_to change { member.reload.user }
    end

    it 'publishes :already_a_member' do
      service.call
      expect(listener).to have_received(:already_a_member).with(existing_member)
    end
  end

  context 'when updating the member fails' do
    before do
      allow(member).to receive(:update).with(anything).and_return(false)
    end

    it 'does not change the existing membership' do
      expect { service.call }.not_to change { member.reload.user }
    end

    it 'publishes :already_a_member' do
      service.call
      expect(listener).to have_received(:invalid).with(member)
    end
  end

  context 'when the invitation has already been declined' do
    before { invitation.declined! }

    it 'does not change the existing membership' do
      expect { service.call }.not_to change { member.reload.user }
    end

    it 'publishes :expired' do
      service.call
      expect(listener).to have_received(:expired).with(invitation)
    end
  end
end
