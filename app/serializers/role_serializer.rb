# frozen_string_literal: true

class RoleSerializer < ActiveModel::Serializer
  attributes :id, :name, :plural, :slug
end
