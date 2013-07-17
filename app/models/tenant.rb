require 'PgTools'

class Tenant < ActiveRecord::Base
  attr_accessible :subdomain, :user
  belongs_to :user
  after_create :create_schema
  after_commit :create_admin
  
  #create new schema once the schema is created
  def create_schema
    connection.execute("create schema tenant#{id}")
    scope_schema do
      load Rails.root.join("db/schema.rb")
      connection.execute("drop table #{self.class.table_name}")
    end
  end
  
  #used to crete first user and admin of the tenant scheme
  def create_admin
    user = User.find_by_id(self.user_id)
    scope_schema do
      tenant_admin = User.new(
         :first_name => user.first_name, 
         :last_name => user.last_name,   
         :email => user.email, 
         :encrypted_password => user.encrypted_password,
         :company_name => user.company_name
      )
      tenant_admin.add_role :admin
      tenant_admin.save(:validate=> false)
      sign_in tenant_admin, :bypass => true 
    end
  end
  
  def scope_schema(*paths)
    original_search_path = connection.schema_search_path
    path = ["tenant#{id}", *paths].join(",")
    connection.schema_search_path = path
    yield if block_given?
  ensure
    connection.schema_search_path = original_search_path
  end
end
