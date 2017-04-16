require 'rails_helper'

describe InviteMember, type: :service do
  subject(:service) { InviteMember.new(member, admin, email) }

  let(:member) { create(:member) }
  let(:admin) { create(:administrator, group: member.group) }
  let(:email) { 'test@example.com' }
  let(:mail) { double }

  before do
    allow(InvitationMailer)
      .to receive(:invitation_email)
      .with(an_instance_of(Invitation))
      .and_return(mail)
    allow(mail).to receive(:deliver_later)
  end

  it 'creates an invitation' do
    expect { service.call }.to change { member.invitations.count }.by 1
  end

  it 'sends an email' do
    service.call
    expect(mail).to have_received(:deliver_later)
  end

  context 'when the invitation is invalid' do
    let(:admin) { create(:administrator) }

    it 'does not create an invitation' do
      expect { service.call }.not_to change { member.invitations.count }
    end

    it 'does not send an email' do
      service.call
      expect(mail).not_to have_received(:deliver_later)
    end
  end
end
