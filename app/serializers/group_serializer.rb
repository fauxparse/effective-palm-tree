# frozen_string_literal: true

class GroupSerializer < ActiveModel::Serializer
  attributes :name, :slug
  has_many :members
  has_many :roles
end
