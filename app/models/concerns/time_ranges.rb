# frozen_string_literal: true
module TimeRanges
  extend ActiveSupport::Concern

  included do
    scope :before, ->(time) { where('starts_at < ?', time) }
    scope :after, ->(time) { where('ends_at IS NULL OR ? < ends_at', time) }
    scope :between, ->(t1, t2) { after(t1).before(t2) }
  end
end
