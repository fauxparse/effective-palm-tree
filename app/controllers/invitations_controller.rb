class InvitationsController < ApplicationController
  def create
    if member && admin
      render json: invitation
    else
      head :forbidden
    end
  end

  private

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
      InviteMember
      .new(member, admin, invitation_params[:email])
      .tap(&:call)
      .invitation
  end
end
