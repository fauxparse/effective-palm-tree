# frozen_string_literal: true

class MembersController < ApplicationController
  def index
    respond_to do |format|
      format.json { render json: memberships }
    end
  end

  def show
    respond_to do |format|
      format.json { render json: membership, includes: :pending_invitations }
    end
  end

  private

  def memberships
    @memberships ||= group.members.includes(:user)
  end

  def membership
    @membership ||=
      group
      .members
      .includes(:user, :pending_invitations)
      .find_by(slug: params[:id])
  end
end
