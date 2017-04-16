class InviteMember
  attr_reader :invitation

  def initialize(member, admin, email)
    @invitation = member.invitations.build(admin: admin, email: email)
  end

  def call
    invitation.save && send_invitation_email
  end

  private

  def send_invitation_email
    InvitationMailer.invitation_email(invitation).deliver_later
  end
end
