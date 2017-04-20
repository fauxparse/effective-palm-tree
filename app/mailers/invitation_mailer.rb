class InvitationMailer < ApplicationMailer
  default from: 'noreply@example.com'

  def invitation_email(invitation)
    @invitation = invitation
    @admin = invitation.admin
    @member = invitation.member
    @group = invitation.group

    mail(
      to: @invitation.email,
      subject: "#{@admin.name} has invited you to join #{@group.name}"
    )
  end
end
