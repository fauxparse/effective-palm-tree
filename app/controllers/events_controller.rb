# frozen_string_literal: true

class EventsController < ApplicationController
  def index
    respond_to do |format|
      format.json { render json: events.all }
    end
  end

  def roles
    respond_to do |format|
      format.json do
        UpdateEventRoles.new(event, role_params).call
        render json: occurrence, include: [:allocations]
      end
    end
  end

  def assignments
    respond_to do |format|
      format.json do
        UpdateAssignments.new(occurrence, assignment_params).call
        render json: occurrence, include: %i[allocations assignments]
      end
    end
  end

  private

  def events
    @events ||= EventOccurrences.new(
      scope: event_scope,
      start: params[:start],
      stop: params[:stop]
    )
  end

  def event_scope
    @event_scope ||= Event.for_user(current_user)
  end

  def role_params
    params.permit(roles: %i[id min max role_id])[:roles]
  end

  def assignment_params
    params[:assignments]
  end
end
