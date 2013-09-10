RailsStripeMembershipSaas::Application.routes.draw do
  mount StripeEvent::Engine => '/stripe'
  get '/overview', :to => 'home#tour'
  get '/examples', :to => 'home#examples'
  
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
  
  #controller endpoints
  get 'timecards/today', :to => 'timecards#today' 
  get 'timecards/:in_date/:out_date', :to => 'timecards#date' 
  get 'timecards/:in_date/:out_date/:user_id', :to => 'timecards#date_and_user_id' 
  resources :timecards 
  
  #backbone endpoints
  get ':in_date/:out_date', :to => 'content#index'
  get ':in_date/:out_date/:user_id', :to => 'content#index'
  get ':in_date/:out_date/:user_id/:timecard_id', :to => 'content#index'
  
end