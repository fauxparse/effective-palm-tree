require 'rails_helper'

RSpec.describe InvitationsController, type: :request do
  let(:admin) { create(:administrator, group: member.group) }
  let(:current_user_id) { admin.user_id }
  let(:member) { create(:member) }
  let(:email) { 'test@example.com' }
  let(:mail) { double }

  before do
    allow(mail).to receive(:deliver_later)
    allow(InvitationMailer)
      .to receive(:invitation_email)
      .with(an_instance_of(Invitation))
      .and_return(mail)
  end

  describe 'POST #create' do
    subject { response }

    let(:params) { { invitation: { member_id: member.id, email: email } } }
    let(:url) { invitations_path(as: current_user_id) }

    before do
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

  describe 'PUT #update' do
    subject { response }

    let!(:invitation) do
      create(:invitation, member: member, admin: admin, email: email)
    end

    let(:url) { invitation_path(invitation, as: current_user_id) }

    def resend_invitation
      put url
    end

    it 'is_successful' do
      resend_invitation
      expect(response).to be_success
    end

    it 'does not create a new invitation' do
      expect { resend_invitation }.not_to change(Invitation, :count)
    end

    it 'sends an email' do
      resend_invitation
      expect(mail).to have_received(:deliver_later)
    end

    context 'when the current user is not an admin' do
      let(:current_user_id) { create(:user).id }

      before { resend_invitation }

      it { is_expected.to have_http_status(:forbidden) }
    end
  end

  describe 'DELETE #destroy' do
    subject { response }

    let!(:invitation) do
      create(:invitation, member: member, admin: admin, email: email)
    end

    let(:url) { invitation_path(invitation, as: current_user_id) }

    def cancel_invitation
      delete url
    end

    it 'is_successful' do
      cancel_invitation
      expect(response).to be_success
    end

    it 'deletes the invitation' do
      expect { cancel_invitation }.to change(Invitation, :count).by(-1)
    end

    context 'when the current user is not an admin' do
      let(:current_user_id) { create(:user).id }

      before { cancel_invitation }

      it { is_expected.to have_http_status(:forbidden) }
    end
  end
end
