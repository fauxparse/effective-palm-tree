class MemberSerializer < ActiveModel::Serializer
  attributes :id, :name, :admin
  belongs_to :group
end
