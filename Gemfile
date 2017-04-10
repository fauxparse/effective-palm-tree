# frozen_string_literal: true

source 'https://rubygems.org'
ruby '2.4.0'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '~> 5.1.0.rc1'

# Use postgresql as the database for Active Record
gem 'pg', '~> 0.18'
# Use Puma as the app server
gem 'puma', '~> 3.0'
# Use SCSS for stylesheets
gem 'sass-rails', github: 'rails/sass-rails'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker', github: 'rails/webpacker'

# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.2'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

gem 'active_model_serializers', '~> 0.10.0'
gem 'acts_as_list'
gem 'auto_strip_attributes', '~> 2.1'
gem 'autoprefixer-rails'
gem 'bitters', github: 'thoughtbot/bitters'
gem 'bourbon', '>= 5.0.0.beta.7'
gem 'clearance'
gem 'ice_cube'
gem 'neat'
gem 'normalize-rails'
gem 'stringex', '>= 2.7.1'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: %i[mri mingw x64_mingw]
  gem 'factory_girl_rails'
  gem 'rspec-rails'
end

group :development do
  gem 'guard'
  gem 'guard-ctags-bundler', require: false
  gem 'guard-rspec', require: false
  gem 'guard-rubocop', require: false
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'pry-rails'
  gem 'rubocop', require: false
  gem 'spring'
  gem 'spring-commands-rspec'
  gem 'web-console', github: 'rails/web-console'
end

group :test do
  gem 'codeclimate-test-reporter', '~> 1.0.0'
  gem 'rspec-collection_matchers'
  gem 'rubocop-rspec', github: 'backus/rubocop-rspec'
  gem 'shoulda-matchers', '~> 3.1'
  gem 'simplecov'
  gem 'timecop'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]
