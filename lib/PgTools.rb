module PgTools
  extend self

  def search_path
    ActiveRecord::Base.connection.schema_search_path
  end

  def default_search_path
    @default_search_path ||= %{"$user", public}
  end

  def set_search_path(name, include_public = true)
    path_parts = ["tenant#{name}", ("public" if include_public)].compact
    ActiveRecord::Base.connection.schema_search_path = path_parts.join(",")
  end

  def restore_default_search_path
    ActiveRecord::Base.connection.schema_search_path = default_search_path
  end

  def default_scope_schema(*paths)
    original_search_path = search_path
    restore_default_search_path
    yield if block_given?
  ensure
    (ActiveRecord::Base.connection.schema_search_path = original_search_path) if block_given?
  end
end