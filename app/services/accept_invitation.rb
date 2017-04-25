class AcceptInvitation
  include Cry

  attr_accessor :invitation, :user

  def initialize(invitation, user)
    @invitation = invitation
    @user = user
  end

  def call
    if !invitation.pending?
      publish :expired, invitation
    elsif existing_member?
      publish :already_a_member, membership
    elsif accept
      publish :success, membership
    else
      publish :invalid, member
    end
  end

  private

  delegate :member, to: :invitation

  def existing_member?
    membership.present?
  end

  def membership
    @membership ||= user.memberships.find_by(group_id: member.group_id)
  end

  def accept
    member.update(user: user) && invitation.accepted!
  end
end
