module InvitationHelpers
  def invitation_emails(email)
    unread_emails_for(email).select { |m| m.subject =~ /invited/i }
  end
end

World(InvitationHelpers)
