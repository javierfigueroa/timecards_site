require 'PgTools'

class Tenant < ActiveRecord::Base
  attr_accessible :subdomain, :user
  has_many :users
  after_create :create_schema
  before_destroy :destroy_schema
  validates :subdomain, :presence   => true,
                        :uniqueness => true,
                        :subdomain  => true
  
  #create new schema once the schema is created
  def create_schema
    self.class.connection.execute("create schema tenant#{id}")
    scope_schema do
      load Rails.root.join("db/schema.rb")
      self.class.connection.execute("drop table #{self.class.table_name}")
      connection.execute("drop table sessions")
      YAML.load(ENV['ROLES']).each do |role|
        Role.find_or_create_by(name: role)
      end
    end
  end
  
  def scope_schema(*paths)
    original_search_path = self.class.connection.schema_search_path
    path = ["tenant#{id}", *paths].join(",")
    self.class.connection.schema_search_path = path
    yield if block_given?
  ensure
    (self.class.connection.schema_search_path = original_search_path) if block_given?
  end
  
  def destroy_schema
    self.class.connection.execute("drop schema tenant#{id} cascade")
  end

  def self.create_by(options)
    # code here
  end
end
