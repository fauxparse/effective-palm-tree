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

  def group
    @group ||= current_user.groups.find_by(slug: params[:group_id])
  end

  def event
    @event ||= group.events.find_by(slug: params[:event_id]) if group
  end

  def occurrence
    @occurrence ||= event.occurrences.on(date) if event
  end

  def date
    @date ||= Date.parse(params[:id])
  end
end
