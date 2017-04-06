# frozen_string_literal: true

class OccurrencesController < ApplicationController
  def show
    respond_to do |format|
      format.json do
        if occurrence.present?
          render json: occurrence, include: %i[allocations assignments]
        else
          head :not_found
        end
      end
    end
  end
end
