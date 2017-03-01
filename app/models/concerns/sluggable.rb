module Sluggable
  extend ActiveSupport::Concern

  included do
    acts_as_url :name,
      url_attribute: :slug,
      limit: 128,
      duplicate_sequence: random_deduplicator

    validates :name,
      presence: true,
      length: { in: 4..128, allow_blank: true }

    alias_method :to_param, :slug
  end

  module ClassMethods
    def random_deduplicator
      Enumerator.new { |enum| loop { enum.yield rand(10000..99999) } }
    end
  end
end
