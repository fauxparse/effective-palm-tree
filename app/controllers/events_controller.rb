class EventsController < ApplicationController
  def index
    respond_to do |format|
      format.json { render json: events.all }
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
end
