require 'rails_helper'

RSpec.describe InvitationMailer, type: :mailer do
  describe '#invitation_email' do
    let(:mail) { InvitationMailer.invitation_email(invitation) }
    let(:invitation) do
      create(:invitation, admin: admin, member: member, email: email)
    end
    let(:group) { create(:group, name: 'Sulaco') }
    let(:admin) { create(:administrator, name: 'Burke', group: group) }
    let(:member) { create(:member, name: 'Ripley', group: group) }
    let(:email) { 'ripley@sula.co' }

    it 'is delivered to the correct address' do
      expect(mail.to).to include email
    end

    it 'has the correct subject' do
      expect(mail.subject).to eq 'Burke has invited you to join Sulaco'
    end
  end
end
