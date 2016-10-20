Rails.application.routes.draw do

  root 'dashboard/home#index'

  scope module: 'home' do
    resources :registrations, only: [:new, :create]
    get "/sign_up", to: "registrations#new", as: :sign_up

    resources :sessions

    get "/login", to: "sessions#new", as: :login
    post "/logout", to: "sessions#destroy", as: :logout

    post "oauth/callback" => "oauths#callback"
    get "oauth/callback" => "oauths#callback" # for use with Github, Facebook
    get "oauth/:provider" => "oauths#oauth", as: :auth_at_provider
  end

  scope module: 'dashboard' do
    resources :decks do
      resources :cards
    end

    get "/decks/:id/activate" => "decks#activate", as: :activate_deck
    get "/decks/:id/deactivate" => "decks#deactivate", as: :deactivate_deck

    patch "/decks/:deck_id/cards/:id/check" => "training#check", as: :check_card

    get "/change_locale" => "home#change_locale", as: :change_locale

    resource :users, only: [:show, :edit, :update]
  end



















end
