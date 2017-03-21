# frozen_string_literal: true
class Role < ApplicationRecord
  include Sluggable

  belongs_to :group
  has_many :allocations, dependent: :destroy

  validates :name, uniqueness: { scope: :group_id, case_sensitive: false }

  def plural
    super.presence || name.try!(:pluralize)
  end
end
