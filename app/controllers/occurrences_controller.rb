class OccurrencesController < ApplicationController
  def show
    respond_to do |format|
      format.json do
        if occurrence.present?
          render json: occurrence
        else
          head :not_found
        end
      end
    end
  end

  private

  def event
    @event ||= Event.where(slug: params[:event_id]).first!
  end

  def occurrence
    @occurrence ||= event.occurrences.on(date)
  end

  def date
    @date ||= Date.parse(params[:id])
  end
end
