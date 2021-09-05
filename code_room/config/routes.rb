Rails.application.routes.draw do
  scope path: :api, defaults: { format: 'json' } do
    resources :users, only: [:create, :show, :destroy, :index] do
      resources :documents, shallow: true do
      end
    end
    
    resources :rooms, only: [:create, :show, :destroy]

    resource :session, only: [:create, :destroy]
  end

  root "static#index"
  get "*path" => "static#index"
end
