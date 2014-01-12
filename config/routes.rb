RailsStripeMembershipSaas::Application.routes.draw do

  mount StripeEvent::Engine => '/stripe'
  get '/features', :to => 'home#features'
  get '/examples', :to => 'home#examples'
  get '/about', :to => 'home#about'
#   
  # authenticated :user do
    # root :to => 'content#index', as: :authenticated_root
  # end
  # root :to => 'devise/sessions#new'
  
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

  resources :timecards 
  resources :projects  
  resources :users
  
  get 'users/:in_date/:out_date', :to => 'users#date' 
  get 'projects/:in_date/:out_date', :to => 'projects#date' 
  get 'timecards/today', :to => 'timecards#today' 
  get 'timecards/:in_date/:out_date', :to => 'timecards#date_and_user_id' 
  
  # scope :constraints => lambda {|r| r.env["warden"].authenticate? } do
    # all my logged in routes
    #backbone endpoints
    get 'users/:in_date/:out_date', :to => 'content#index'
    get 'projects/:in_date/:out_date', :to => 'content#index'
    get 'timecards/:in_date/:out_date/project/:project_id', :to => 'content#index'
    get 'timecards/:in_date/:out_date/project/:project_id/:timecard_id', :to => 'content#index'
    get 'timecards/:in_date/:out_date/user/:user_id', :to => 'content#index'
    get 'timecards/:in_date/:out_date/user/:user_id/:timecard_id', :to => 'content#index'
  # end
end