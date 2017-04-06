# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Clearance::Controller
  protect_from_forgery with: :exception
  serialization_scope :view_context

  after_action :render_application, unless: :performed?
  rescue_from ActionController::UnknownFormat, with: :try_to_render_application

  private

  def render_application
    render html: '', layout: true
  end

  def try_to_render_application(exception)
    request.format.html? ? render_application : raise(exception)
  end

  def group(param = :group_id)
    @group ||= current_user.groups.with_members.find_by(slug: params[param])
  end

  def event(param = :event_id)
    @event ||= group.events.find_by(slug: params[param]) if group
  end

  def occurrence
    @occurrence ||= event.occurrences.occurring_on(date) if event
  end

  def date
    @date ||= Date.parse(params[:date] || params[:occurrence_date])
  end
end
