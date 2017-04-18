class InvitationsController < ApplicationController
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
    if admin_for_invitation?
      invitation.destroy
      render_invitation
    else
      head :forbidden
    end
  end

  private

  def render_invitation
    status = invitation.valid? ? :ok : :not_acceptable
    render json: invitation, status: status
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
    @invitation ||= Invitation.find_by!(token: params[:id])
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
