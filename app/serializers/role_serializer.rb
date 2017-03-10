class RoleSerializer < ActiveModel::Serializer
  attributes :id, :name, :plural, :slug
end
