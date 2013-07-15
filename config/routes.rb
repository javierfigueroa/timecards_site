RailsStripeMembershipSaas::Application.routes.draw do
  mount StripeEvent::Engine => '/stripe'
  get "content/gold"
  get "content/silver"
  get "content/platinum"
  authenticated :user do
    root :to => 'home#index'
  end
  root :to => "home#index"
  devise_for :users, :controllers => { :registrations => 'registrations', :sessions => "sessions" }
  devise_scope :user do
    put 'update_plan', :to => 'registrations#update_plan'
    put 'update_card', :to => 'registrations#update_card'
    namespace :api do
      resources :sessions, :only => [:create, :destroy]
    end
  end
  resources :users
  
  
  # authenticated :user do
    # root :to => 'jobs#index'
  # end
#   
  # root :to => "jobs#index"
  # devise_for  :users, 
              # :path => '', 
              # :path_names => { :sign_in => "login", :sign_out => "logout", :sign_up => "register" },
              # :controllers => { :sessions => "sessions" }
# 
  # devise_scope :user do
    # namespace :api do
      # resources :sessions, :only => [:create, :destroy]
    # end
  # end
end