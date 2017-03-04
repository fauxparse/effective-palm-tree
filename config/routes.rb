Rails.application.routes.draw do
  resources :events, only: [:index, :new]
  scope '/events/:group_id/:event_id', as: 'event' do
    resources :occurrences, path: '', id: /\d{4}-\d{2}-\d{2}/
  end

  root to: 'events#index'
end
