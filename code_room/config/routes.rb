Rails.application.routes.draw do
  resources :users, only: [:new, :create, :show, :destroy] do
    resources :documents, only: [:create, :index, :update, :edit, :destroy] do
      resources :rooms, only: [:create, :show, :destroy]
    end
  end

  resource :session, only: [:new, :create, :destroy]
end
