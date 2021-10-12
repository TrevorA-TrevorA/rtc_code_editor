Rails.application.routes.draw do
  scope path: :api, defaults: { format: 'json' } do
    resources :users, only: [:create, :show, :destroy, :index], shallow: true do
      resources :documents
      resources :collaborations, only: [:index, :update, :create, :destroy]
      resources :notifications, only: [:create, :update, :destroy]
    end
    resource :session, only: [:create, :destroy]
  end

  patch "api/users/:user_id/notifications" => "notifications#update_all"
  delete "api/users/:user_id/notifications" => "notifications#destroy_all"

  root "static#index"
  get "*path" => "static#index"
end
