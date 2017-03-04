module Sluggable
  extend ActiveSupport::Concern

  included do
    puts sluggable_options.inspect
    acts_as_url :name, sluggable_options

    validates :name,
      presence: true,
      length: { in: 4..128, allow_blank: true }

    alias_method :to_param, :slug
  end

  module ClassMethods
    def random_deduplicator
      Enumerator.new { |enum| loop { enum.yield rand(10_000..99_999) } }
    end

    def sluggable_options
      options = {
        url_attribute: :slug,
        limit: 128,
        duplicate_sequence: random_deduplicator
      }
      options[:scope] = const_get(:SLUGGABLE_SCOPE) \
        if const_defined?(:SLUGGABLE_SCOPE)
      options
    end
  end
end
