RailsStripeMembershipSaas::Application.routes.draw do
  get 'timecards/today', :to => 'timecards#today' 
  resources :timecards

  mount StripeEvent::Engine => '/stripe'
  get "content/silver" => "timecards#show"
  
  authenticated :user do
    root :to => 'home#index'
  end
  match '', to: 'home#index', constraints: lambda { |r| r.subdomain.present? && r.subdomain != 'www' }
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
  
end