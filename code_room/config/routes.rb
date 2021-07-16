Rails.application.routes.draw do
  root 'sessions#new'
  get '/dash/:user_id', to: 'users#show', as: 'user_dash'
  resources :users, only: [:new, :create, :show, :destroy] do
    resources :documents, except: [:new, :show], shallow: true do
    end
  end
  
  resources :rooms, only: [:create, :show, :destroy]

  get '/sign-in', to: 'sessions#new', as: 'sign_in'
  resource :session, only: [:new, :create, :destroy]
end
