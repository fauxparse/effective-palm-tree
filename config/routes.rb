Rails.application.routes.draw do
  get 'availability/update'

  resource :session, only: [:show, :create, :destroy]

  resources :events, only: [:index, :new]
  scope '/events/:group_id/:event_id', as: 'event' do
    resources :occurrences, path: '', param: :date, date: /\d{4}-\d{2}-\d{2}/ do
      resource :availability, only: [:show, :update]
    end
    patch 'roles' => 'events#roles'
  end

  root to: 'events#index'
end
