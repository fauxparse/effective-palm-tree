# frozen_string_literal: true

class Member < ApplicationRecord
  include Sluggable

  belongs_to :group, counter_cache: true
  belongs_to :user, optional: true, inverse_of: :memberships
  has_many :availability, dependent: :destroy
  has_many :invitations, dependent: :destroy

  validates :user_id, presence: true, if: :admin?
  validates :user_id, uniqueness: { scope: :group_id, allow_blank: true }

  scope :admin, (-> { where(admin: true) })
end
