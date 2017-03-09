class GroupSerializer < ActiveModel::Serializer
  attributes :name, :slug
  has_many :members
end
