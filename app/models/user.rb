# frozen_string_literal: true

class User < ApplicationRecord
  include Clearance::User

  has_many :memberships, class_name: 'Member'
  has_many :groups, through: :memberships
end
