RailsStripeMembershipSaas::Application.routes.draw do
  get 'timecards/today', :to => 'timecards#today' 
  get 'dashboard', :to => 'content#index'
  
  resources :timecards
  
  mount StripeEvent::Engine => '/stripe'
  authenticated :user do
    root :to => 'content#index', as: :authenticated_root
  end
  root :to => 'home#index'
  
  devise_for :users, :controllers => { :registrations => 'registrations', :sessions => "sessions" }
  devise_scope :user do
    put 'update_plan', :to => 'registrations#update_plan'
    put 'update_card', :to => 'registrations#update_card'
    namespace :api do
      resources :sessions, :only => [:create, :destroy]
    end
  end
  resources :users
  
end