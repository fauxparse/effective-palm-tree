# frozen_string_literal: true

Rails.application.routes.draw do
  get 'availability/update'

  resource :session, only: %i[show create destroy]

  resources :events, only: %i[index new]
  scope '/events/:group_id/:event_id', as: 'event' do
    resources :occurrences, path: '', param: :date, date: /\d{4}-\d{2}-\d{2}/ do
      resource :availability, only: %i[show update]
      patch 'roles' => 'events#roles'
      patch 'assignments' => 'events#assignments'
    end
  end

  root to: 'events#index'
end
