# frozen_string_literal: true

class GroupsController < ApplicationController
  def index
    respond_to do |format|
      format.json { render_memberships(memberships) }
    end
  end

  def show
    respond_to do |format|
      format.json { render_memberships(membership) }
    end
  end

  private

  def memberships
    @memberships ||=
      current_user.memberships.includes(group: { members: :user })
  end

  def membership
    @membership ||= group(:id).members.find_by(user_id: current_user.id)
  end

  def render_memberships(data)
    render json: data, include: { group: %i[members roles] }
  end
end
