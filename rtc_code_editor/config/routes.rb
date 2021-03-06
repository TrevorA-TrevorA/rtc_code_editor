Rails.application.routes.draw do
  scope path: :api, defaults: { format: 'json' } do
    resources :users, only: [:create, :show, :update, :destroy, :index], shallow: true do
      resources :documents
      resources :collaborations, only: [:index, :update, :create, :destroy]
      resources :notifications, only: [:index, :create, :update, :destroy]
    end
    resource :session, only: [:create, :destroy]
  end

  get "users/:id/update_password_form" => "users#update_password_form", as: :update_password_form
  patch "users/update_password/" => "users#update_password"
  get "users/reset-password/:encoded_email" => "users#request_password_reset"
  patch "api/users/:user_id/notifications" => "notifications#update_all"
  delete "api/users/:user_id/notifications" => "notifications#destroy_all"
  delete "api/users/:user_id/collaborations/:document_id" => "collaborations#destroy_by_document"

  root "static#index"
  get "*path" => "static#index"
end
