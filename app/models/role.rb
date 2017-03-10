class Role < ApplicationRecord
  include Sluggable

  belongs_to :group

  validates :name, uniqueness: { scope: :group_id, case_sensitive: false }

  def plural
    super.presence || name.try!(:pluralize)
  end
end
