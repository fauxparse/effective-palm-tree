Rails.application.routes.draw do
  resource :session, only: [:show, :create, :destroy]

  resources :events, only: [:index, :new]
  scope '/events/:group_id/:event_id', as: 'event' do
    resources :occurrences, path: '', id: /\d{4}-\d{2}-\d{2}/
  end

  root to: 'events#index'
end
