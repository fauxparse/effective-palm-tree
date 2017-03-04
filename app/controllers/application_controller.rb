class ApplicationController < ActionController::Base
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
end
