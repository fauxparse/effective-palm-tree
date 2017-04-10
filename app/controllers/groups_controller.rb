# frozen_string_literal: true

class GroupsController < ApplicationController
  def index
    respond_to do |format|
      format.json do
        render json: memberships, include: { group: %i[members roles] }
      end
    end
  end

  def show
    respond_to do |format|
      format.json do
        render json: membership, include: { group: %i[members roles] }
      end
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
end
