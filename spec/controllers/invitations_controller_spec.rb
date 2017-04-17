require 'rails_helper'

RSpec.describe InvitationsController, type: :request do
  describe 'POST #create' do
    subject { response }

    let(:admin) { create(:administrator, group: member.group) }
    let(:current_user_id) { admin.user_id }
    let(:member) { create(:member) }
    let(:email) { 'test@example.com' }
    let(:params) { { invitation: { member_id: member.id, email: email } } }
    let(:url) { invitations_path(as: current_user_id) }
    let(:mail) { double }

    before do
      allow(mail).to receive(:deliver_later)
      allow(InvitationMailer)
        .to receive(:invitation_email)
        .with(an_instance_of(Invitation))
        .and_return(mail)
      post url, params: params, as: :json
    end

    it { is_expected.to be_success }

    it 'creates an invitation' do
      expect(member.invitations.pending.where(email: email)).to exist
    end

    it 'sends an email' do
      expect(mail).to have_received(:deliver_later)
    end

    context 'when the current user is not an admin' do
      let(:admin) { create(:member, :verified, group: member.group) }

      it { is_expected.to have_http_status(:forbidden) }
    end
  end
end
