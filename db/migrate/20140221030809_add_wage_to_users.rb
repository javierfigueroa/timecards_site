class AddWageToUsers < ActiveRecord::Migration
  def change
    add_column :users, :wage, :decimal, :precision => 8, :scale => 2, :null => false, :default => 0
  end
end
