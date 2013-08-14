class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)
    if user.has_role? :admin
      can :manage, :all
    elsif user.has_role? :employee
      can :manage, Timecard, :user_id => user.id
    else
      can :view, Timecard
    end
  end
end