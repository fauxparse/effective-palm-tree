# frozen_string_literal: true
class AvailabilityController < ApplicationController
  def show
    render_availability
  end

  def update
    UpdateAvailability.new(occurrence, params[:availability]).call
    render_availability
  end

  private

  def render_availability
    availability = occurrence.availability.inject({}) do |hash, a|
      hash.update(a.member_id => a.available)
    end
    render json: availability
  end
end
