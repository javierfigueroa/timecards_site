RailsStripeMembershipSaas::Application.routes.draw do

  get '/features', :to => 'home#features'
  get '/examples', :to => 'home#examples'
  get '/about', :to => 'home#about'
  mount StripeEvent::Engine => '/stripe'
  devise_for :users, :controllers => {
      :registrations => 'registrations',
      :sessions => "sessions",
      :passwords => "passwords"
  }
  devise_scope :user do
    put 'update_plan', :to => 'registrations#update_plan'
    put 'update_card', :to => 'registrations#update_card'
    get 'users/billing', :to => 'registrations#billing'
    namespace :api do
      resources :sessions, :only => [:create, :destroy]
    end
    authenticated :user do
      root :to => 'content#index', as: :authenticated_root
    end
    root :to => 'home#index'
  end


  get '/app/users/:in_date/:out_date', :to => 'users#date'
  get '/app/projects/:in_date/:out_date', :to => 'projects#date'
  get '/app/timecards/:in_date/:out_date', :to => 'timecards#date_and_user_id'
  get '/timecards/today', :to => 'timecards#today'

  resources :timecards
  resources :projects

  resources :users

end