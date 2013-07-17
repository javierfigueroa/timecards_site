class CreateTenants < ActiveRecord::Migration
  def change
    create_table :tenants do |t|
      t.belongs_to :user
      t.string :subdomain
      t.string :name
      t.timestamps
    end
  end
end
