# frozen_string_literal: true
class Group < ApplicationRecord
  include Sluggable

  has_many :events
  has_many :members
  has_many :roles

  scope :with_members, -> { includes(members: :user) }
end
