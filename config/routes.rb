RailsStripeMembershipSaas::Application.routes.draw do
  get 'dashboard', :to => 'content#index'
 
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
  
  get 'users/:in_date/:out_date', :to => 'users#date' 
  resources :users
  # get '*path', :to => 'content#index'
  get 'timecards/today', :to => 'timecards#today' 
  get 'timecards/:in_date/:out_date', :to => 'timecards#date' 
  get 'timecards/:in_date/:out_date/:user_id', :to => 'timecards#date_and_user_id' 
  resources :timecards 
end