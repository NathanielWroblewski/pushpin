require ::File.expand_path('../config/environment', __FILE__)

namespace :db do
  desc "Create the database at #{DB_NAME}"
  task :create do
    puts "Creating database #{DB_NAME}"
    exec("createdb #{DB_NAME}")
  end

  desc 'Migrate the database'
  task :migrate do
    ActiveRecord::Migrator.migrations_paths << File.dirname(__FILE__) + 'db/migrate'
    ActiveRecord::Migrator.migrate(ActiveRecord::Migrator.migrations_paths)
  end
end

namespace :generate do
  desc 'Create an empty migration in db/migrate, e.g., rake generate:migration NAME=create_tasks'
  task :migration do
    unless ENV.has_key?('NAME')
      raise 'Must specificy migration name, e.g., rake generate:migration NAME=create_tasks'
    end

    name     = ENV['NAME'].camelize
    filename = "%s_%s.rb" % [Time.now.strftime('%Y%m%d%H%M%S'), ENV['NAME'].underscore]
    path     = APP_ROOT.join('db', 'migrate', filename)

    if File.exist?(path)
      raise "ERROR: File '#{path}' already exists"
    end

    puts "Creating #{path}"
    File.open(path, 'w+') do |f|
      f.write("
        class #{name} < ActiveRecord::Migration
          def change
          end
        end
      ")
    end
  end
end

desc 'Populate the database with dummy data by running db/seeds.rb'
task :seed do
  require APP_ROOT.join('db', 'seeds.rb')
end

desc 'Start IRB with application environment loaded'
task 'console' do
  exec 'irb -r./config/environment'
end
