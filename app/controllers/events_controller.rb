class EventsController < ApplicationController
  def index
    respond_to do |format|
      format.json { render json: events }
    end
  end

  private

  def events
  end
end
