# frozen_string_literal: true

class GroupSerializer < ActiveModel::Serializer
  attributes :name, :id
  has_many :members
  has_many :roles

  def id
    object.to_param
  end
end
