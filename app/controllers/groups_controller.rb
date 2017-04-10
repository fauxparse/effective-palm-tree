# frozen_string_literal: true

class GroupsController < ApplicationController
  def index; end

  def show
    respond_to do |format|
      format.json do
        render json: membership, include: { group: %i[members roles] }
      end
    end
  end

  private

  def membership
    @membership ||= group(:id).members.find_by(user_id: current_user.id)
  end
end
