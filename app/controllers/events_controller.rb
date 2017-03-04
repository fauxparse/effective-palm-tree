class EventsController < ApplicationController
  def index
    respond_to do |format|
      format.json { render json: events.all }
    end
  end

  private

  def events
    @events = EventOccurrences.new(start: params[:start], stop: params[:stop])
  end
end
