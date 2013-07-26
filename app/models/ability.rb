class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)
    if user.has_role? :admin
      can :manage, :all
    else
      can :manage, Timecard, :user_id => user.id
      can :view, :silver if user.has_role? :silver
      can :view, :employee if user.has_role? :employee
    end
  end
end