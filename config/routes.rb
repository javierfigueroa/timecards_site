RailsStripeMembershipSaas::Application.routes.draw do

  mount StripeEvent::Engine => '/stripe'
  get '/features', :to => 'home#features'
  get '/examples', :to => 'home#examples'
  get '/about', :to => 'home#about'
  devise_for :users, :controllers => { :registrations => 'registrations', :sessions => "sessions" }
  devise_scope :user do
    put 'update_plan', :to => 'registrations#update_plan'
    put 'update_card', :to => 'registrations#update_card'
    namespace :api do
      resources :sessions, :only => [:create, :destroy]
    end
    authenticated :user do
      root :to => 'content#index', as: :authenticated_root
    end
    root :to => 'devise/sessions#new'
  end

  
  get 'users/:in_date/:out_date', :to => 'users#date' 
  get 'projects/:in_date/:out_date', :to => 'projects#date' 
  get 'timecards/today.json', :to => 'timecards#today' 
  get 'timecards/:in_date/:out_date', :to => 'timecards#date_and_user_id' 
  
  resources :timecards 
  resources :projects  
  resources :users
end