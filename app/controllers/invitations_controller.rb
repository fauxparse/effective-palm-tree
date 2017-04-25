class InvitationsController < ApplicationController
  def show
    respond_to do |format|
      format.json { render_invitation include: %i[member admin group] }
    end
  end

  def create
    if member && admin
      create_invitation
      render_invitation
    else
      head :forbidden
    end
  end

  def update
    if admin_for_invitation?
      InvitationMailer.invitation_email(invitation).deliver_later
      invitation.touch
      render_invitation
    else
      head :forbidden
    end
  end

  def destroy
    if !invitation
      head :ok
    elsif admin_for_invitation?
      invitation.destroy
      render_invitation
    else
      head :forbidden
    end
  end

  def accept
    AcceptInvitation
      .new(invitation, current_user)
      .on(:success) { render_invitation_with_group_members }
      .on(:expired, :invalid, :already_a_member) { head :not_acceptable }
      .call
  end

  private

  def render_invitation(options = {})
    status = invitation.valid? ? :ok : :not_acceptable
    render options.merge(json: invitation, status: status)
  end

  def render_invitation_with_group_members
    render_invitation include: { member: { group: :members } }
  end

  def invitation_params
    @invitation_params ||=
      params.require(:invitation).permit(:member_id, :email)
  end

  def member
    @member ||= Member.find(invitation_params[:member_id])
  end

  def admin
    @admin ||=
      current_user.memberships.find_by(group_id: member.group_id, admin: true)
  end

  def invitation
    @invitation ||=
      Invitation
      .pending
      .includes(:admin, member: :group)
      .find_by!(token: params[:id])
  end

  def create_invitation
    @invitation =
      InviteMember
      .new(member, admin, invitation_params[:email])
      .tap(&:call)
      .invitation
  end

  def admin_for_invitation?
    current_user
      .memberships
      .where(group_id: invitation.member.group_id)
      .exists?
  end
end