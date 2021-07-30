Rails.application.routes.draw do
  scope path: :api, defaults: { format: 'json' } do
    get '/dash/:user_id', to: 'users#show', as: 'user_dash'
    resources :users, only: [:create, :show, :destroy, :index] do
      resources :documents, except: [:show], shallow: true do
      end
    end
    
    resources :rooms, only: [:create, :show, :destroy]

    resource :session, only: [:create, :destroy]
  end

  root "static#index"
end
