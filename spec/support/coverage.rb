require 'simplecov'

if ENV['CIRCLE_ARTIFACTS']
  dir = File.join(ENV['CIRCLE_ARTIFACTS'], 'coverage')
  SimpleCov.coverage_dir(dir)
end

SimpleCov.add_filter do |src_file|
  File.readlines(src_file.filename).size <= 5
end

SimpleCov.start 'rails'
