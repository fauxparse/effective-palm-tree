Rails.application.routes.draw do
  resources :events do
    resources :occurrences, path: '', id: /\d{4}-\d{2}-\d{2}/
  end

  root to: 'events#index'
end
